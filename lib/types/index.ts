import { z } from 'zod';

export type UserRole = 'district_officer' | 'ngo_coordinator' | 'volunteer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  organization: string;
  zoneAssignment?: string;
  avatarUrl?: string;
}

export type CrisisType = 'flood' | 'heatwave' | 'drought' | 'cyclone' | 'outbreak';
export type Horizon = '24h' | '72h' | '7d';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ResourceType =
  | 'food_kits'
  | 'potable_water'
  | 'medical_kits'
  | 'rescue_boats'
  | 'ambulances'
  | 'emergency_shelters';

export const CrisisTypeSchema = z.enum(['flood', 'heatwave', 'drought', 'cyclone', 'outbreak']);
export const HorizonSchema = z.enum(['24h', '72h', '7d']);
export const SeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const ResourceTypeSchema = z.enum([
  'food_kits',
  'potable_water',
  'medical_kits',
  'rescue_boats',
  'ambulances',
  'emergency_shelters',
]);

// Zone Schema & Type
export const ZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number()]), // [lat, lng]
    radiusKm: z.number().default(6),
  }),
  population: z.number(),
  vulnerableGroups: z.object({
    children: z.number(),
    elderly: z.number(),
    differentlyAbled: z.number(),
    lowIncomeHouseholds: z.number(),
  }),
  vulnerabilityIndex: z.number().min(0).max(1),
  historicalIncidents: z.array(
    z.object({
      year: z.number(),
      type: CrisisTypeSchema,
      description: stringOrUnknown(),
      impactScore: z.number(),
    })
  ),
  stock: z.record(z.string(), z.number()),
  riskByCrisis: z.record(
    CrisisTypeSchema,
    z.object({
      score: z.number().min(0).max(100),
      severity: SeveritySchema,
      summary: z.string(),
    })
  ),
  topThreats: z.array(z.string()),
  recommendedActions: z.array(z.string()),
});

function stringOrUnknown() {
  return z.string();
}

export type Zone = z.infer<typeof ZoneSchema>;

// Warehouse Schema & Type
export const WarehouseSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  managerName: z.string(),
  contact: z.string(),
  capacityScore: z.number().min(0).max(100),
  stock: z.record(z.string(), z.number()),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;

// Resource Schema & Type
export const ResourceSchema = z.object({
  id: z.string(),
  type: ResourceTypeSchema,
  name: z.string(),
  unit: z.string(),
  totalAvailable: z.number(),
  warehouseId: z.string(),
  warehouseName: z.string(),
  minThreshold: z.number(),
  unitCostInr: z.number(),
});

export type Resource = z.infer<typeof ResourceSchema>;

// Factor Schema & Type
export const FactorSchema = z.object({
  id: z.string(),
  name: z.string(),
  contributionPct: z.number(), // relative contribution percentage
  direction: z.enum(['increases_risk', 'decreases_risk']),
  impactValue: z.string(),
  explanation: z.string(),
});

export type Factor = z.infer<typeof FactorSchema>;

// Prediction Schema & Type
export const PredictionSchema = z.object({
  zoneId: z.string(),
  zoneName: z.string(),
  crisisType: CrisisTypeSchema,
  horizon: HorizonSchema,
  riskScore: z.number().min(0).max(100),
  severity: SeveritySchema,
  confidence: z.number().min(0).max(100),
  factors: z.array(FactorSchema),
  forecastTimeline: z.array(
    z.object({
      timeLabel: z.string(),
      score: z.number(),
      lowerBound: z.number(),
      upperBound: z.number(),
    })
  ),
  historicalContext: z.string(),
  lastUpdated: z.string(),
});

export type Prediction = z.infer<typeof PredictionSchema>;

// Allocation Plan Schema & Type
export const AllocationAssignmentSchema = z.object({
  id: z.string(),
  resourceType: ResourceTypeSchema,
  resourceName: z.string(),
  zoneId: z.string(),
  zoneName: z.string(),
  warehouseId: z.string(),
  warehouseName: z.string(),
  quantity: z.number(),
  unit: z.string(),
  etaMinutes: z.number(),
  severity: SeveritySchema,
  justification: z.string(),
});

export type AllocationAssignment = z.infer<typeof AllocationAssignmentSchema>;

export const AllocationPlanSchema = z.object({
  id: z.string(),
  assignments: z.array(AllocationAssignmentSchema),
  peopleCovered: z.number(),
  totalAtRisk: z.number(),
  fairnessScore: z.number().min(0).max(100),
  unmetNeedPct: z.number().min(0).max(100),
  estimatedResponseTimeHours: z.number(),
  createdBy: z.string(),
  status: z.enum(['draft', 'approved', 'dispatched']),
  createdAt: z.string(),
});

export type AllocationPlan = z.infer<typeof AllocationPlanSchema>;

// Dispatch Task Schema & Type
export const DispatchTaskSchema = z.object({
  id: z.string(),
  planId: z.string(),
  resource: z.string(),
  resourceType: ResourceTypeSchema,
  qty: z.number(),
  unit: z.string(),
  fromWarehouse: z.string(),
  toZone: z.string(),
  status: z.enum(['pending', 'in_transit', 'delivered']),
  eta: z.string(),
  progress: z.number().min(0).max(100),
  assignee: z.object({
    name: z.string(),
    role: z.string(),
    phone: z.string(),
  }),
  lastUpdated: z.string(),
});

export type DispatchTask = z.infer<typeof DispatchTaskSchema>;

// Community Report Schema & Type
export const ReportSchema = z.object({
  id: z.string(),
  type: z.enum([
    'flood_inundation',
    'food_shortage',
    'medical_emergency',
    'shelter_damaged',
    'drinking_water_scarcity',
    'power_road_blocked',
  ]),
  typeLabel: z.string(),
  zoneId: z.string(),
  zoneName: z.string(),
  location: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  urgency: SeveritySchema,
  description: z.string(),
  reporterName: z.string(),
  reporterPhone: z.string(),
  status: z.enum(['pending_verification', 'action_assigned', 'resolved']),
  createdAt: z.string(),
  imageUrl: z.string().optional(),
});

export type Report = z.infer<typeof ReportSchema>;

// Alert Schema & Type
export const AlertSchema = z.object({
  id: z.string(),
  zoneId: z.string(),
  zoneName: z.string(),
  severity: SeveritySchema,
  message: z.string(),
  crisisType: CrisisTypeSchema,
  createdAt: z.string(),
  read: z.boolean(),
});

export type Alert = z.infer<typeof AlertSchema>;

// Standard API response error envelope
export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}
