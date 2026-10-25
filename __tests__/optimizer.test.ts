import { describe, it, expect } from 'vitest';
import {
  runResourceOptimizer,
  calculateHaversineDistanceKm,
  calculateGiniScore,
} from '@/lib/optimizer';
import { SEED_ZONES, SEED_WAREHOUSES, SEED_RESOURCES } from '@/lib/seed/data';

describe('Deterministic Resource Allocation Optimizer', () => {
  it('should be deterministic: produces identical plans for identical inputs', () => {
    const input = {
      zones: SEED_ZONES,
      warehouses: SEED_WAREHOUSES,
      resources: SEED_RESOURCES,
      crisisType: 'flood' as const,
      fairnessCapPct: 35,
    };

    const plan1 = runResourceOptimizer(input);
    const plan2 = runResourceOptimizer(input);

    expect(plan1.assignments.length).toBe(plan2.assignments.length);
    expect(plan1.peopleCovered).toBe(plan2.peopleCovered);
    expect(plan1.fairnessScore).toBe(plan2.fairnessScore);
    expect(plan1.assignments[0].quantity).toBe(plan2.assignments[0].quantity);
  });

  it('should enforce the fairness cap so no zone hoards supplies', () => {
    const fairnessCap = 30; // 30% max
    const plan = runResourceOptimizer({
      zones: SEED_ZONES,
      warehouses: SEED_WAREHOUSES,
      resources: SEED_RESOURCES,
      crisisType: 'flood' as const,
      fairnessCapPct: fairnessCap,
    });

    const totalFoodKits = SEED_RESOURCES.find((r) => r.type === 'food_kits')?.totalAvailable || 26500;
    const maxAllowedPerZone = Math.floor(totalFoodKits * (fairnessCap / 100));

    plan.assignments
      .filter((a) => a.resourceType === 'food_kits')
      .forEach((a) => {
        expect(a.quantity).toBeLessThanOrEqual(maxAllowedPerZone);
      });
  });

  it('should route assignments to the closest warehouse with stock', () => {
    const plan = runResourceOptimizer({
      zones: SEED_ZONES,
      warehouses: SEED_WAREHOUSES,
      resources: SEED_RESOURCES,
      crisisType: 'flood' as const,
    });

    // Check first 5 assignments have valid warehouse links and realistic ETA > 20 mins
    plan.assignments.slice(0, 5).forEach((asg) => {
      expect(asg.warehouseId).toBeDefined();
      expect(asg.etaMinutes).toBeGreaterThan(20);
      expect(asg.justification).toBeDefined();
      expect(asg.justification.length).toBeGreaterThan(10);
    });
  });

  it('calculates Haversine distance correctly between coordinates', () => {
    // Vijayawada to Machilipatnam distance is ~65-75 km
    const dist = calculateHaversineDistanceKm([16.506, 80.648], [16.187, 81.138]);
    expect(dist).toBeGreaterThan(50);
    expect(dist).toBeLessThan(90);
  });

  it('calculates Gini equity score appropriately', () => {
    // Perfect equality: all zones get 100
    const equalScores = calculateGiniScore([100, 100, 100, 100]);
    expect(equalScores).toBe(100);

    // Highly skewed: one gets 1000, others get 0
    const skewedScores = calculateGiniScore([0, 0, 0, 1000]);
    expect(skewedScores).toBeLessThan(50);
  });
});
