import { describe, it, expect, beforeEach } from 'vitest';
import { crisisService } from '@/lib/services/crisisService';
import { calculateCrisisRisk } from '@/lib/risk/engine';

describe('ReliefIQ End-to-End Decision & Allocation Workflow', () => {
  it('executes full end-to-end disaster response lifecycle', () => {
    // 1. Ingest & Fetch Zones on Dashboard
    const zones = crisisService.getZones();
    expect(zones.length).toBeGreaterThanOrEqual(15);

    // 2. Locate critical zone (Diviseema)
    const criticalZone = zones.find((z) => z.id === 'zone-4');
    expect(criticalZone).toBeDefined();
    expect(criticalZone?.riskByCrisis.flood.severity).toBe('critical');

    // 3. Inspect Explainable Risk Prediction
    const prediction = crisisService.getPrediction('zone-4', 'flood', '24h');
    expect(prediction.riskScore).toBeGreaterThanOrEqual(80);
    expect(prediction.factors.length).toBeGreaterThan(0);
    expect(prediction.factors[0].explanation).toBeDefined();

    // 4. Run What-If Simulation
    const simulated = calculateCrisisRisk({
      crisisType: 'flood',
      rainfallMm: 320,
      windSpeedKmh: 95,
      temperatureC: 32,
      displacedPopulation: 25000,
      riverDischargeCusecs: 900000,
      vulnerabilityIndex: criticalZone!.vulnerabilityIndex,
    });
    expect(simulated.riskScore).toBeGreaterThanOrEqual(85);
    expect(simulated.humanImpactEstimate.recommendedRescueBoats).toBeGreaterThan(0);

    // 5. Run AI Allocation Optimizer
    const plan = crisisService.runOptimizer('flood', 35);
    expect(plan.assignments.length).toBeGreaterThan(0);
    expect(plan.peopleCovered).toBeGreaterThan(0);
    expect(plan.fairnessScore).toBeGreaterThanOrEqual(60);

    // 6. Manual Override Check
    const firstAssignment = plan.assignments[0];
    const initialQty = firstAssignment.quantity;
    firstAssignment.quantity += 500;
    expect(plan.assignments[0].quantity).toBe(initialQty + 500);

    // 7. Approve & Dispatch
    const initialTasksCount = crisisService.getDispatchTasks().length;
    const approvalResult = crisisService.approvePlan(plan.id);
    expect(approvalResult.success).toBe(true);
    expect(approvalResult.tasksCreated).toBeGreaterThan(0);

    // 8. Confirm tasks appear in Dispatch board
    const updatedTasks = crisisService.getDispatchTasks();
    expect(updatedTasks.length).toBe(initialTasksCount + approvalResult.tasksCreated);

    // 9. Move a dispatch task to Delivered
    const activeTask = updatedTasks[0];
    const deliveredTask = crisisService.updateDispatchTaskStatus(activeTask.id, 'delivered');
    expect(deliveredTask?.status).toBe('delivered');
    expect(deliveredTask?.progress).toBe(100);

    // 10. File Community Report and ensure it enters live alerts feed
    const initialAlertsCount = crisisService.getAlerts().length;
    const report = crisisService.createReport({
      type: 'flood_inundation',
      typeLabel: 'Severe Flood Inundation',
      zoneId: 'zone-4',
      zoneName: 'Diviseema',
      location: 'Nagayalanka Jetty North',
      coordinates: [15.952, 80.918],
      urgency: 'critical',
      description: 'Water level crossed 4 feet, 50 families trapped on temple roof.',
      reporterName: 'M. Venkatesh',
      reporterPhone: '+91 99887 76655',
    });
    expect(report.id).toBeDefined();

    // Alert feed must receive the new emergency report
    const newAlerts = crisisService.getAlerts();
    expect(newAlerts.length).toBe(initialAlertsCount + 1);
    expect(newAlerts[0].severity).toBe('critical');
    expect(newAlerts[0].message).toContain('CITIZEN REPORT');
  });
});
