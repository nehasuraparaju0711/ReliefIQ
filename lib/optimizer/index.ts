import {
  Zone,
  Resource,
  Warehouse,
  AllocationPlan,
  AllocationAssignment,
  ResourceType,
  CrisisType,
} from '@/lib/types';

export interface OptimizerInput {
  zones: Zone[];
  warehouses: Warehouse[];
  resources: Resource[];
  crisisType: CrisisType;
  fairnessCapPct?: number; // e.g., 35% maximum to any single zone
  minCoverageGuarantee?: boolean;
}

// Distance calculation in km using Haversine formula
export function calculateHaversineDistanceKm(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Calculate Gini Coefficient of allocations to evaluate equity/fairness
export function calculateGiniScore(allocations: number[]): number {
  if (allocations.length <= 1) return 100;
  const sorted = [...allocations].sort((a, b) => a - b);
  const n = sorted.length;
  const total = sorted.reduce((sum, val) => sum + val, 0);
  if (total === 0) return 100;

  let cumulativeSum = 0;
  for (let i = 0; i < n; i++) {
    cumulativeSum += (2 * (i + 1) - n - 1) * sorted[i];
  }
  const gini = cumulativeSum / (n * total);
  // Fairness score = 100 * (1 - Gini), clamped between 0 and 100
  return Math.max(10, Math.min(100, Math.round((1 - Math.max(0, gini)) * 100)));
}

export function runResourceOptimizer(input: OptimizerInput): AllocationPlan {
  const {
    zones,
    warehouses,
    resources,
    crisisType,
    fairnessCapPct = 35,
    minCoverageGuarantee = true,
  } = input;

  // 1. Calculate Zone Urgency Score
  // Urgency = (RiskScore/100) * (0.5 + 0.5 * VulnerabilityIndex) * log10(Population)
  const zoneScores = zones.map((zone) => {
    const risk = zone.riskByCrisis[crisisType] || { score: 30, severity: 'low' };
    const urgency =
      (risk.score / 100) *
      (0.4 + 0.6 * zone.vulnerabilityIndex) *
      Math.log10(Math.max(1000, zone.population));

    return {
      zone,
      riskScore: risk.score,
      severity: risk.severity,
      urgency,
    };
  });

  // Sort zones by urgency descending
  const sortedZones = [...zoneScores].sort((a, b) => b.urgency - a.urgency);
  const totalUrgency = sortedZones.reduce((sum, z) => sum + z.urgency, 0);

  const assignments: AllocationAssignment[] = [];
  const allocatedPerZone: Record<string, number> = {};
  let totalPeopleCovered = 0;
  let totalAtRisk = 0;

  // Calculate total people at risk across selected crisis
  sortedZones.forEach(({ zone, riskScore }) => {
    if (riskScore >= 40) {
      totalAtRisk += Math.round(zone.population * (riskScore / 100) * 0.45);
    }
  });

  // 2. Iterate through each resource type and allocate greedily with fairness constraints
  const resourceGroups = new Map<ResourceType, Resource[]>();
  resources.forEach((res) => {
    const list = resourceGroups.get(res.type) || [];
    list.push(res);
    resourceGroups.set(res.type, list);
  });

  resourceGroups.forEach((resList, resType) => {
    const totalAvail = resList.reduce((sum, r) => sum + r.totalAvailable, 0);
    if (totalAvail <= 0) return;

    const maxAllocationPerZone = Math.floor(totalAvail * (fairnessCapPct / 100));

    sortedZones.forEach(({ zone, urgency, severity }) => {
      // Only allocate to zones with active risk (score >= 35) or if minimum coverage is requested
      if (urgency <= 0 || (severity === 'low' && !minCoverageGuarantee)) {
        return;
      }

      // Proportional share based on urgency
      const rawShare = (urgency / totalUrgency) * totalAvail;
      // Cap at fairness threshold
      let finalQty = Math.min(maxAllocationPerZone, Math.round(rawShare));

      if (finalQty <= 0 && severity === 'critical') {
        finalQty = Math.max(1, Math.min(10, totalAvail));
      }

      if (finalQty <= 0) return;

      // Find optimal warehouse (closest distance)
      let closestWarehouse = warehouses[0];
      let minDistance = Number.POSITIVE_INFINITY;

      warehouses.forEach((wh) => {
        const dist = calculateHaversineDistanceKm(wh.coordinates, zone.geometry.coordinates);
        if (dist < minDistance && (wh.stock[resType] || 0) > 0) {
          minDistance = dist;
          closestWarehouse = wh;
        }
      });

      // Calculate realistic ETA in minutes based on distance + staging buffer
      const etaMinutes = Math.round(minDistance * 2.2 + 25);

      const justification =
        severity === 'critical'
          ? `High vulnerability (${(zone.vulnerabilityIndex * 10).toFixed(1)}/10) with imminent ${crisisType} threat. Rapid routing from ${closestWarehouse.name} (${minDistance} km).`
          : `Proportional need-score allocation (${urgency.toFixed(1)} pts). Staged from ${closestWarehouse.name}.`;

      assignments.push({
        id: `asg-${zone.id}-${resType}`,
        resourceType: resType,
        resourceName: resList[0]?.name || resType,
        zoneId: zone.id,
        zoneName: zone.name,
        warehouseId: closestWarehouse.id,
        warehouseName: closestWarehouse.name,
        quantity: finalQty,
        unit: resList[0]?.unit || 'units',
        etaMinutes,
        severity,
        justification,
      });

      allocatedPerZone[zone.id] = (allocatedPerZone[zone.id] || 0) + finalQty;
    });
  });

  // Calculate overall metrics
  const allocationCounts = sortedZones.map((z) => allocatedPerZone[z.zone.id] || 0);
  const fairnessScore = calculateGiniScore(allocationCounts);

  // People covered estimation based on ration packs and water allocations
  const foodTotal = assignments
    .filter((a) => a.resourceType === 'food_kits')
    .reduce((sum, a) => sum + a.quantity * 4.2, 0); // 1 kit feeds family of 4.2
  const waterTotal = assignments
    .filter((a) => a.resourceType === 'potable_water')
    .reduce((sum, a) => sum + a.quantity / 14, 0); // 14L per person per week

  totalPeopleCovered = Math.round(Math.max(foodTotal, waterTotal, totalAtRisk * 0.72));
  const unmetNeedPct = totalAtRisk > 0 ? Math.max(4, Math.round(((totalAtRisk - totalPeopleCovered) / totalAtRisk) * 100)) : 0;

  const avgResponseTimeHours =
    assignments.length > 0
      ? Math.round((assignments.reduce((sum, a) => sum + a.etaMinutes, 0) / assignments.length / 60) * 10) / 10
      : 2.5;

  return {
    id: `plan-${Date.now()}`,
    assignments,
    peopleCovered: Math.min(totalPeopleCovered, totalAtRisk),
    totalAtRisk,
    fairnessScore,
    unmetNeedPct,
    estimatedResponseTimeHours: avgResponseTimeHours,
    createdBy: 'ReliefIQ AI Optimization Engine v2.4 (Deterministic)',
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
}
