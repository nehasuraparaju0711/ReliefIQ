import {
  Zone,
  Prediction,
  AllocationPlan,
  DispatchTask,
  Report,
  Alert,
  Resource,
  CrisisType,
  Horizon,
} from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `API Error: ${res.status} ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson?.error) errorMsg = errJson.error;
    } catch {
      // fallback to status text
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  // Zones
  getZones: async (): Promise<Zone[]> => {
    const res = await fetch(`${BASE_URL}/api/zones`, { cache: 'no-store' });
    return handleResponse<Zone[]>(res);
  },

  getZoneById: async (id: string): Promise<Zone> => {
    const res = await fetch(`${BASE_URL}/api/zones/${id}`, { cache: 'no-store' });
    return handleResponse<Zone>(res);
  },

  // Predictions
  getPrediction: async (
    zoneId: string,
    type: CrisisType = 'flood',
    horizon: Horizon = '24h'
  ): Promise<Prediction> => {
    const params = new URLSearchParams({ zone: zoneId, type, horizon });
    const res = await fetch(`${BASE_URL}/api/predictions?${params.toString()}`, {
      cache: 'no-store',
    });
    return handleResponse<Prediction>(res);
  },

  // Allocations
  runAllocation: async (
    crisisType: CrisisType = 'flood',
    fairnessCapPct = 35
  ): Promise<AllocationPlan> => {
    const res = await fetch(`${BASE_URL}/api/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crisisType, fairnessCapPct }),
    });
    return handleResponse<AllocationPlan>(res);
  },

  approveAllocation: async (
    planId: string
  ): Promise<{ success: boolean; tasksCreated: number }> => {
    const res = await fetch(`${BASE_URL}/api/allocate/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    return handleResponse<{ success: boolean; tasksCreated: number }>(res);
  },

  // Dispatch Tasks
  getDispatchTasks: async (): Promise<DispatchTask[]> => {
    const res = await fetch(`${BASE_URL}/api/dispatch`, { cache: 'no-store' });
    return handleResponse<DispatchTask[]>(res);
  },

  updateDispatchTask: async (
    id: string,
    status: 'pending' | 'in_transit' | 'delivered'
  ): Promise<DispatchTask> => {
    const res = await fetch(`${BASE_URL}/api/dispatch`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return handleResponse<DispatchTask>(res);
  },

  // Reports
  getReports: async (): Promise<Report[]> => {
    const res = await fetch(`${BASE_URL}/api/reports`, { cache: 'no-store' });
    return handleResponse<Report[]>(res);
  },

  createReport: async (
    data: Omit<Report, 'id' | 'createdAt' | 'status'>
  ): Promise<Report> => {
    const res = await fetch(`${BASE_URL}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Report>(res);
  },

  // Alerts
  getAlerts: async (): Promise<Alert[]> => {
    const res = await fetch(`${BASE_URL}/api/alerts`, { cache: 'no-store' });
    return handleResponse<Alert[]>(res);
  },

  markAlertRead: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE_URL}/api/alerts`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Inventory
  getInventory: async (): Promise<{ resources: Resource[]; warehouses: unknown[] }> => {
    const res = await fetch(`${BASE_URL}/api/inventory`, { cache: 'no-store' });
    return handleResponse<{ resources: Resource[]; warehouses: unknown[] }>(res);
  },

  requestRestock: async (
    resourceId: string,
    quantity: number
  ): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE_URL}/api/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, quantity }),
    });
    return handleResponse<{ success: boolean }>(res);
  },
};
