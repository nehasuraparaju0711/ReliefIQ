import {
  SEED_ZONES,
  SEED_WAREHOUSES,
  SEED_RESOURCES,
  SEED_ALERTS,
  SEED_DISPATCH_TASKS,
  SEED_REPORTS,
} from '@/lib/seed/data';
import {
  Zone,
  Warehouse,
  Resource,
  Alert,
  DispatchTask,
  Report,
  Prediction,
  AllocationPlan,
  CrisisType,
  Horizon,
  Severity,
} from '@/lib/types';
import { calculateCrisisRisk } from '@/lib/risk/engine';
import { runResourceOptimizer } from '@/lib/optimizer';

// In-memory service state (persists across Next.js API calls in Node process)
class CrisisDataService {
  private zones: Zone[] = [...SEED_ZONES];
  private warehouses: Warehouse[] = [...SEED_WAREHOUSES];
  private resources: Resource[] = [...SEED_RESOURCES];
  private alerts: Alert[] = [...SEED_ALERTS];
  private dispatchTasks: DispatchTask[] = [...SEED_DISPATCH_TASKS];
  private reports: Report[] = [...SEED_REPORTS];
  private currentPlan: AllocationPlan | null = null;

  // ZONES
  public getZones(): Zone[] {
    return this.zones;
  }

  public getZoneById(id: string): Zone | undefined {
    return this.zones.find((z) => z.id === id);
  }

  // PREDICTIONS
  public getPrediction(
    zoneId: string,
    crisisType: CrisisType = 'flood',
    horizon: Horizon = '24h'
  ): Prediction {
    const zone = this.getZoneById(zoneId) || this.zones[0];
    const riskData = zone.riskByCrisis[crisisType] || { score: 45, severity: 'medium' as Severity };

    // Dynamic weather mock baseline according to horizon
    const horizonMultiplier = horizon === '24h' ? 1.0 : horizon === '72h' ? 1.15 : 1.25;
    const baseRainfall = crisisType === 'flood' ? 180 * horizonMultiplier : 25;
    const baseWind = crisisType === 'cyclone' ? 110 * horizonMultiplier : 20;
    const baseTemp = crisisType === 'heatwave' ? 44.5 : 32.0;

    const evaluation = calculateCrisisRisk({
      crisisType,
      rainfallMm: baseRainfall,
      windSpeedKmh: baseWind,
      temperatureC: baseTemp,
      displacedPopulation: Math.round(zone.population * 0.08),
      riverDischargeCusecs: crisisType === 'flood' ? 780000 : 250000,
      vulnerabilityIndex: zone.vulnerabilityIndex,
    });

    const timeline = [
      {
        timeLabel: horizon === '24h' ? 'T - 6h' : 'Day 1',
        score: Math.max(10, evaluation.riskScore - 12),
        lowerBound: Math.max(5, evaluation.riskScore - 18),
        upperBound: Math.min(100, evaluation.riskScore - 6),
      },
      {
        timeLabel: horizon === '24h' ? 'Present' : 'Day 2',
        score: evaluation.riskScore,
        lowerBound: Math.max(5, evaluation.riskScore - 8),
        upperBound: Math.min(100, evaluation.riskScore + 8),
      },
      {
        timeLabel: horizon === '24h' ? 'T + 12h' : 'Day 3',
        score: Math.min(99, evaluation.riskScore + 6),
        lowerBound: Math.max(5, evaluation.riskScore - 2),
        upperBound: Math.min(100, evaluation.riskScore + 14),
      },
      {
        timeLabel: horizon === '24h' ? 'T + 24h' : 'Day 4',
        score: Math.min(99, evaluation.riskScore + 4),
        lowerBound: Math.max(5, evaluation.riskScore - 4),
        upperBound: Math.min(100, evaluation.riskScore + 12),
      },
    ];

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      crisisType,
      horizon,
      riskScore: evaluation.riskScore,
      severity: evaluation.severity,
      confidence: evaluation.confidence,
      factors: evaluation.factors,
      forecastTimeline: timeline,
      historicalContext: `Zone has recorded ${zone.historicalIncidents.length} major incidents in the last 20 years. Current vulnerability index: ${(zone.vulnerabilityIndex * 10).toFixed(1)}/10.`,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // ALERTS (Supports polling)
  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public markAlertAsRead(id: string): boolean {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.read = true;
      return true;
    }
    return false;
  }

  public addSimulatedAlert(): Alert {
    const randomZone = this.zones[Math.floor(Math.random() * this.zones.length)];
    const newAlert: Alert = {
      id: `alt-${Date.now()}`,
      zoneId: randomZone.id,
      zoneName: randomZone.name,
      severity: 'high',
      message: `AUTOMATED SENSOR ALERT: Water level sensor breach detected near ${randomZone.name}. Rapid response team notified.`,
      crisisType: 'flood',
      createdAt: 'Just now',
      read: false,
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  // DISPATCH TASKS
  public getDispatchTasks(): DispatchTask[] {
    return this.dispatchTasks;
  }

  public updateDispatchTaskStatus(
    id: string,
    status: 'pending' | 'in_transit' | 'delivered'
  ): DispatchTask | null {
    const task = this.dispatchTasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.progress = status === 'delivered' ? 100 : status === 'in_transit' ? 65 : 10;
      task.lastUpdated = 'Just now';
      return task;
    }
    return null;
  }

  // COMMUNITY REPORTS
  public getReports(): Report[] {
    return this.reports;
  }

  public createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
    const zone = this.getZoneById(reportData.zoneId);
    const newReport: Report = {
      ...reportData,
      id: `rep-${Date.now()}`,
      zoneName: zone ? zone.name : reportData.zoneName,
      status: 'pending_verification',
      createdAt: 'Just now',
    };

    this.reports.unshift(newReport);

    // Also trigger a live alert so it immediately reflects on the dashboard & alert feed
    const alert: Alert = {
      id: `alt-rep-${newReport.id}`,
      zoneId: newReport.zoneId,
      zoneName: newReport.zoneName,
      severity: newReport.urgency,
      message: `CITIZEN REPORT (${newReport.urgency.toUpperCase()}): ${newReport.typeLabel} reported in ${newReport.location}`,
      crisisType: 'flood',
      createdAt: 'Just now',
      read: false,
    };
    this.alerts.unshift(alert);

    return newReport;
  }

  // WAREHOUSES & INVENTORY
  public getWarehouses(): Warehouse[] {
    return this.warehouses;
  }

  public getResources(): Resource[] {
    return this.resources;
  }

  public requestRestock(resourceId: string, quantity: number): boolean {
    const res = this.resources.find((r) => r.id === resourceId);
    if (res) {
      res.totalAvailable += quantity;
      return true;
    }
    return false;
  }

  // ALLOCATION OPTIMIZER
  public runOptimizer(crisisType: CrisisType = 'flood', fairnessCapPct = 35): AllocationPlan {
    const plan = runResourceOptimizer({
      zones: this.zones,
      warehouses: this.warehouses,
      resources: this.resources,
      crisisType,
      fairnessCapPct,
    });
    this.currentPlan = plan;
    return plan;
  }

  public approvePlan(planId: string): { success: boolean; tasksCreated: number } {
    if (!this.currentPlan) {
      // Generate standard plan if none in buffer
      this.currentPlan = this.runOptimizer('flood');
    }

    const plan = this.currentPlan;
    plan.status = 'approved';

    // Convert top assignments into actual dispatch tasks
    const newTasks: DispatchTask[] = plan.assignments.slice(0, 6).map((asg, idx) => ({
      id: `tsk-ai-${Date.now()}-${idx}`,
      planId: plan.id,
      resource: asg.resourceName,
      resourceType: asg.resourceType,
      qty: asg.quantity,
      unit: asg.unit,
      fromWarehouse: asg.warehouseName,
      toZone: asg.zoneName,
      status: 'in_transit',
      eta: `${asg.etaMinutes} mins`,
      progress: 30,
      assignee: {
        name: idx % 2 === 0 ? 'Capt. Harish Kumar (SDRF Fleet)' : 'K. Sai Krishna (Volunteer Lead)',
        role: idx % 2 === 0 ? 'State Rapid Response Convoy' : 'AP Relief Volunteer Team',
        phone: '+91 98480 91823',
      },
      lastUpdated: 'Just now (Approved by District Authority)',
    }));

    this.dispatchTasks.unshift(...newTasks);

    // Create an alert on approval
    this.alerts.unshift({
      id: `alt-plan-${plan.id}`,
      zoneId: 'zone-4',
      zoneName: 'District Multi-Zone',
      severity: 'low',
      message: `PLAN APPROVED: AI allocation plan executed. ${newTasks.length} rapid dispatch convoys mobilized.`,
      crisisType: 'flood',
      createdAt: 'Just now',
      read: false,
    });

    return { success: true, tasksCreated: newTasks.length };
  }
}

// Global singleton instance
export const crisisService = new CrisisDataService();
