// Generic data client for real-time dashboard endpoints
// Configure in .env:
// VITE_API_BASE_URL=https://api.example.com

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;

function isApiConfigured() {
  return Boolean(API_BASE);
}

async function apiGet<T>(path: string): Promise<T> {
  if (!isApiConfigured()) throw new Error("API not configured");
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}

export type MachineRow = { id: string; name: string; status: 'On' | 'Off'; operator: string; order: string };
export type ShiftInfoLive = { name: string; start: string; end: string; progress: number };
export type WorkOrderLive = { id: string; product: string; progress: number };
export type DowntimeRow = { time: string; machine: string; type: string; duration: string };
export type CountRow = { label: string; value: number };

export async function fetchMachinesLive(): Promise<MachineRow[]> {
  if (!isApiConfigured()) {
    return [
      { id: 'M-A1', name: 'Machine A1', status: 'On', operator: 'Alice J.', order: 'WO-2024-001' },
      { id: 'M-B2', name: 'Machine B2', status: 'Off', operator: '—', order: '—' },
      { id: 'M-C3', name: 'Machine C3', status: 'On', operator: 'Bob S.', order: 'WO-2024-002' },
    ];
  }
  return apiGet<MachineRow[]>(`/machines/status`);
}

export async function fetchShiftLive(): Promise<ShiftInfoLive> {
  if (!isApiConfigured()) return { name: 'Morning', start: '06:00', end: '14:00', progress: 62 };
  return apiGet<ShiftInfoLive>(`/shift/current`);
}

export async function fetchWorkOrderLive(): Promise<WorkOrderLive> {
  if (!isApiConfigured()) return { id: 'WO-2024-001', product: 'Engine Block A1', progress: 75 };
  return apiGet<WorkOrderLive>(`/workorder/current`);
}

export async function fetchDowntimeLive(): Promise<DowntimeRow[]> {
  if (!isApiConfigured()) {
    return [
      { time: '14:05', machine: 'Machine B2', type: 'Unplanned Stop', duration: '8m' },
      { time: '13:40', machine: 'Machine C3', type: 'Tool Change', duration: '4m' },
    ];
  }
  return apiGet<DowntimeRow[]>(`/downtime/recent`);
}

export async function fetchCountsLive(): Promise<CountRow[]> {
  if (!isApiConfigured()) {
    return [
      { label: 'Good', value: 300 },
      { label: 'Scrap', value: 12 },
      { label: 'Rework', value: 7 },
    ];
  }
  return apiGet<CountRow[]>(`/production/counts`);
}

// --- Performance & OEE ---
export type Scope = 'machine' | 'line';
export type GroupBy = 'article' | 'sub-article' | 'shift' | 'work-order';

export type OeeBreakdown = {
  availability: number; // 0-100
  performance: number;  // 0-100
  quality: number;      // 0-100
  oee: number;          // 0-100
  by?: Array<{ key: string; availability: number; performance: number; quality: number; oee: number }>;
};

export type AssignedWorker = { id: string; name: string; role?: string };

export type MachineVsHumanCounts = {
  machine: { good: number; scrap: number; rework?: number };
  human?: { good?: number; scrap?: number; rework?: number };
};

export async function fetchEntities(scope: Scope): Promise<string[]> {
  if (!isApiConfigured()) {
    return scope === 'machine'
      ? ['Machine A1', 'Machine B2', 'Machine C3']
      : ['Line 1', 'Line 2'];
  }
  return apiGet<string[]>(`/entities?scope=${scope}`);
}

export async function fetchOeeMetrics(params: { scope: Scope; entity: string; groupBy: GroupBy }): Promise<OeeBreakdown> {
  if (!isApiConfigured()) {
    // Stub OEE with simple group-by breakdown
    const base = { availability: 88, performance: 82, quality: 96 };
    const calc = (b: typeof base) => ({ ...b, oee: Math.round((b.availability/100)*(b.performance/100)*(b.quality/100)*100) });
    const overall = calc(base);
    const byMap: Record<GroupBy, Array<{ key: string; availability: number; performance: number; quality: number; oee: number }>> = {
      'article': ['A-100', 'A-200', 'A-300'].map((k,i)=>{ const b = { availability: 85+i, performance: 80+i, quality: 95-i }; const c=calc(b); return { key:k, ...c }; }),
      'sub-article': ['A-100-1','A-100-2'].map((k,i)=>{ const b = { availability: 87-i, performance: 81+i, quality: 96-i }; const c=calc(b); return { key:k, ...c }; }),
      'shift': ['Morning','Afternoon','Night'].map((k,i)=>{ const b = { availability: 86+i, performance: 79+i, quality: 94+i%2 }; const c=calc(b); return { key:k, ...c }; }),
      'work-order': ['WO-001','WO-002'].map((k,i)=>{ const b = { availability: 89-i, performance: 83-i, quality: 97-i }; const c=calc(b); return { key:k, ...c }; }),
    };
    return { ...overall, by: byMap[params.groupBy] };
  }
  const q = new URLSearchParams({ scope: params.scope, entity: params.entity, groupBy: params.groupBy }).toString();
  return apiGet<OeeBreakdown>(`/oee?${q}`);
}

export async function fetchAssignedWorkers(params: { scope: Scope; entity: string }): Promise<AssignedWorker[]> {
  if (!isApiConfigured()) {
    return [
      { id: 'op1', name: 'Alice Johnson', role: 'Operator' },
      { id: 'op2', name: 'Bob Smith', role: 'QC' },
    ];
  }
  const q = new URLSearchParams({ scope: params.scope, entity: params.entity }).toString();
  return apiGet<AssignedWorker[]>(`/workers?${q}`);
}

export async function fetchMachineCounts(params: { scope: Scope; entity: string; groupBy: GroupBy; key?: string }): Promise<MachineVsHumanCounts> {
  if (!isApiConfigured()) {
    return { machine: { good: 120, scrap: 6, rework: 3 } };
  }
  const q = new URLSearchParams({ scope: params.scope, entity: params.entity, groupBy: params.groupBy, key: params.key ?? '' }).toString();
  return apiGet<MachineVsHumanCounts>(`/counts?${q}`);
}
