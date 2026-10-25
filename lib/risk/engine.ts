import { CrisisType, Severity, Factor } from '@/lib/types';

export interface RiskInputParams {
  crisisType: CrisisType;
  rainfallMm: number; // 0 - 500 mm (normal: 20-50)
  windSpeedKmh: number; // 0 - 200 km/h (normal: 10-25)
  temperatureC: number; // 15 - 52 °C (normal: 30-34)
  displacedPopulation: number; // 0 - 150,000
  riverDischargeCusecs?: number; // 0 - 1,200,000 cusecs
  vulnerabilityIndex: number; // 0.0 - 1.0 (zone demographic factor)
  historicalIncidentFactor?: number; // 0.5 - 1.5
  drainageCapacityPct?: number; // 0 - 100%
}

export interface RiskEvaluationResult {
  riskScore: number; // 0 - 100
  severity: Severity;
  confidence: number; // 0 - 100
  factors: Factor[];
  humanImpactEstimate: {
    peopleInImmediateDanger: number;
    householdsAtRisk: number;
    recommendedFoodKits: number;
    recommendedWaterLiters: number;
    recommendedMedicalPacks: number;
    recommendedRescueBoats: number;
    recommendedAmbulances: number;
    recommendedShelterTents: number;
  };
  deltaVsBaseline?: {
    scoreDiff: number;
    dangerDiff: number;
  };
}

export function calculateCrisisRisk(params: RiskInputParams): RiskEvaluationResult {
  const {
    crisisType,
    rainfallMm,
    windSpeedKmh,
    temperatureC,
    displacedPopulation,
    riverDischargeCusecs = 250000,
    vulnerabilityIndex,
    drainageCapacityPct = 60,
  } = params;

  let rawScore = 20; // baseline
  const factors: Factor[] = [];

  switch (crisisType) {
    case 'flood': {
      // Rainfall weight (0-350mm -> up to 45 pts)
      const rainContribution = Math.min(45, (rainfallMm / 280) * 45);
      // River discharge / barrage outflow (0-1,000,000 cusecs -> up to 35 pts)
      const dischargeContribution = Math.min(35, (riverDischargeCusecs / 850000) * 35);
      // Drainage backlog penalty
      const drainagePenalty = Math.max(0, ((100 - drainageCapacityPct) / 100) * 15);
      // Vulnerability multiplier
      const vulnMultiplier = 0.8 + vulnerabilityIndex * 0.4;

      rawScore = (rainContribution + dischargeContribution + drainagePenalty) * vulnMultiplier;

      factors.push({
        id: 'f-rain',
        name: 'Monsoon Precipitation Intensity',
        contributionPct: Math.round(Math.min(100, (rainfallMm / 250) * 85)),
        direction: rainfallMm > 100 ? 'increases_risk' : 'decreases_risk',
        impactValue: `${rainfallMm.toFixed(0)} mm / 24h`,
        explanation:
          rainfallMm > 150
            ? 'Heavy continuous rainfall exceeds natural run-off drainage capacity.'
            : 'Precipitation within safe municipal absorption thresholds.',
      });

      factors.push({
        id: 'f-river',
        name: 'Upstream River / Barrage Discharge',
        contributionPct: Math.round(Math.min(100, (riverDischargeCusecs / 800000) * 90)),
        direction: riverDischargeCusecs > 500000 ? 'increases_risk' : 'decreases_risk',
        impactValue: `${(riverDischargeCusecs / 100000).toFixed(1)} Lakh Cusecs`,
        explanation:
          riverDischargeCusecs > 600000
            ? 'Prakasam Barrage discharge exceeds first warning embankment safety limits.'
            : 'Controlled discharge through spillway gates.',
      });

      factors.push({
        id: 'f-drainage',
        name: 'Topographic Run-off & Embankment Integrity',
        contributionPct: Math.round(100 - drainageCapacityPct),
        direction: drainageCapacityPct < 50 ? 'increases_risk' : 'decreases_risk',
        impactValue: `${drainageCapacityPct}% capacity`,
        explanation:
          drainageCapacityPct < 60
            ? 'Canal siltation and urban encroachment slow flood discharge rate.'
            : 'Unobstructed drainage sluice channels.',
      });
      break;
    }

    case 'cyclone': {
      const windContribution = Math.min(50, (windSpeedKmh / 160) * 50);
      const rainContribution = Math.min(30, (rainfallMm / 200) * 30);
      const vulnMultiplier = 0.75 + vulnerabilityIndex * 0.5;

      rawScore = (windContribution + rainContribution) * vulnMultiplier;

      factors.push({
        id: 'f-wind',
        name: 'Peak Wind Gust Velocity',
        contributionPct: Math.round(Math.min(100, (windSpeedKmh / 140) * 95)),
        direction: windSpeedKmh > 75 ? 'increases_risk' : 'decreases_risk',
        impactValue: `${windSpeedKmh.toFixed(0)} km/h`,
        explanation:
          windSpeedKmh > 80
            ? 'Severe cyclonic storm winds capable of tearing tin roofs and uprooting transmission poles.'
            : 'Moderate coastal squall conditions.',
      });

      factors.push({
        id: 'f-surge',
        name: 'Projected Tidal Inundation',
        contributionPct: Math.round(Math.min(100, (windSpeedKmh / 120) * 75)),
        direction: windSpeedKmh > 90 ? 'increases_risk' : 'decreases_risk',
        impactValue: `${(windSpeedKmh * 0.024).toFixed(1)} m surge`,
        explanation: 'High marine storm surge threatening fishing villages and salt pan bunds.',
      });
      break;
    }

    case 'heatwave': {
      // Temperature (35 to 50 C)
      const tempDiff = Math.max(0, temperatureC - 36);
      const tempContribution = Math.min(70, (tempDiff / 14) * 70);
      const vulnMultiplier = 0.8 + vulnerabilityIndex * 0.4;

      rawScore = (tempContribution + 20) * vulnMultiplier;

      factors.push({
        id: 'f-temp',
        name: 'Maximum Ambient Dry-Bulb Temperature',
        contributionPct: Math.round(Math.min(100, (temperatureC / 48) * 90)),
        direction: temperatureC > 41 ? 'increases_risk' : 'decreases_risk',
        impactValue: `${temperatureC.toFixed(1)} °C`,
        explanation:
          temperatureC > 42
            ? 'Heat index exceeds biological tolerance for outdoor agricultural labor.'
            : 'Elevated daytime temperatures within seasonal safety buffer.',
      });

      factors.push({
        id: 'f-duration',
        name: 'Consecutive Dry Spell Days',
        contributionPct: 74,
        direction: 'increases_risk',
        impactValue: '5+ consecutive days',
        explanation: 'Prolonged heat wave depletes shallow groundwater and elevates heatstroke fatality rates.',
      });
      break;
    }

    case 'drought': {
      const rainDeficit = Math.max(0, 100 - (rainfallMm / 150) * 100);
      const heatPenalty = Math.max(0, (temperatureC - 34) * 3);
      rawScore = (rainDeficit * 0.65 + heatPenalty * 0.35) * (0.8 + vulnerabilityIndex * 0.3);

      factors.push({
        id: 'f-deficit',
        name: 'Precipitation Deficit Ratio',
        contributionPct: Math.round(rainDeficit),
        direction: 'increases_risk',
        impactValue: `-${rainDeficit.toFixed(0)}% vs normal`,
        explanation: 'Cumulative seasonal rainfall deficiency straining rural irrigation reservoirs.',
      });
      break;
    }

    case 'outbreak': {
      const floodStagnation = Math.min(50, (rainfallMm / 200) * 50);
      const displacedStress = Math.min(40, (displacedPopulation / 25000) * 40);
      rawScore = (floodStagnation * 0.5 + displacedStress * 0.5 + 15) * (0.85 + vulnerabilityIndex * 0.3);

      factors.push({
        id: 'f-waterlogging',
        name: 'Flood Water Stagnation & Saline Backflow',
        contributionPct: Math.round(Math.min(100, floodStagnation * 1.8)),
        direction: 'increases_risk',
        impactValue: 'Submerged settlements',
        explanation: 'Standing warm water triggers exponential breeding of Aedes and Anopheles vectors.',
      });

      factors.push({
        id: 'f-displacement',
        name: 'Shelter Population Density',
        contributionPct: Math.round(Math.min(100, displacedStress * 2.2)),
        direction: 'increases_risk',
        impactValue: `${displacedPopulation.toLocaleString('en-IN')} persons`,
        explanation: 'Overcrowded temporary relief camps amplify respiratory and enteric transmission.',
      });
      break;
    }
  }

  // Displacement factor applies to all
  if (displacedPopulation > 0 && !factors.find((f) => f.id === 'f-displacement')) {
    const displacementBonus = Math.min(15, (displacedPopulation / 30000) * 15);
    rawScore += displacementBonus;
    factors.push({
      id: 'f-displacement',
      name: 'Displaced Population Density',
      contributionPct: Math.round(Math.min(100, (displacedPopulation / 20000) * 80)),
      direction: 'increases_risk',
      impactValue: `${displacedPopulation.toLocaleString('en-IN')} evacuees`,
      explanation: 'High displacement strains local food distribution nodes and temporary sanitation.',
    });
  }

  // Demographic vulnerability factor
  factors.push({
    id: 'f-socioeconomic',
    name: 'Socioeconomic & Demographic Vulnerability',
    contributionPct: Math.round(vulnerabilityIndex * 100),
    direction: vulnerabilityIndex > 0.6 ? 'increases_risk' : 'decreases_risk',
    impactValue: `Index: ${(vulnerabilityIndex * 10).toFixed(1)} / 10`,
    explanation:
      vulnerabilityIndex > 0.7
        ? 'High concentration of kutcha housing, elderly citizens, and unpaved evacuation pathways.'
        : 'Solid pucca infrastructure and accessible arterial highways.',
  });

  const finalScore = Math.max(8, Math.min(98, Math.round(rawScore)));

  let severity: Severity = 'low';
  if (finalScore >= 80) severity = 'critical';
  else if (finalScore >= 65) severity = 'high';
  else if (finalScore >= 40) severity = 'medium';
  else severity = 'low';

  const confidence = Math.round(86 + (finalScore % 11) - (vulnerabilityIndex * 5));

  // Human impact modeling
  const multiplier = finalScore / 100;
  const peopleInDanger = Math.round(displacedPopulation * 0.9 + 1500 * multiplier * 12);
  const households = Math.max(12, Math.round(peopleInDanger / 4.2));

  return {
    riskScore: finalScore,
    severity,
    confidence,
    factors: factors.slice(0, 5),
    humanImpactEstimate: {
      peopleInImmediateDanger: peopleInDanger,
      householdsAtRisk: households,
      recommendedFoodKits: Math.round(households * 1.15),
      recommendedWaterLiters: Math.round(peopleInDanger * 14), // 2 liters/day * 7 days
      recommendedMedicalPacks: Math.max(10, Math.round(households * 0.12)),
      recommendedRescueBoats: finalScore > 70 && (crisisType === 'flood' || crisisType === 'cyclone') ? Math.max(2, Math.round(peopleInDanger / 1800)) : 0,
      recommendedAmbulances: Math.max(1, Math.round(peopleInDanger / 4500)),
      recommendedShelterTents: Math.max(5, Math.round(households * 0.22)),
    },
  };
}
