// Policy-based alerts (MTTR breach, performance dip, FPY drop, energy spike)
// with on-call routing & escalation. Offline-first stubs.

export type AlertKind = 'mttr-breach' | 'performance-dip' | 'fpy-drop' | 'energy-spike' | 'micro-stop' | 'order-at-risk';
export type Severity = 'info' | 'warning' | 'critical';

export type Alert = {
  id: string;
  kind: AlertKind;
  severity: Severity;
  machineId?: string;
  line?: string;
  orderId?: string;
  happenedAt: string;
  message: string;
  acknowledged?: boolean;
  routedTo?: string; // user or group
  escalated?: boolean;
};

export type AlertPolicy = {
  mttrMinutes?: number; // breach threshold
  performanceDipPct?: number; // e.g. > 10%
  fpyDropPct?: number; // first-pass yield drop percentage
  energySpikePct?: number; // relative over baseline
  microStopMs?: number; // detect micro-stops
  routing: Array<{ group: string; kinds: AlertKind[]; oncall?: string[]; escalateAfterMin?: number }>;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function safePost<T>(path: string, body: unknown, fallback: T): Promise<T> {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getAlertPolicy(): Promise<AlertPolicy> {
  const local = localStorage.getItem('but.alerts.policy');
  const fallback: AlertPolicy = local ? JSON.parse(local) : {
    mttrMinutes: 30,
    performanceDipPct: 10,
    fpyDropPct: 5,
    energySpikePct: 15,
    microStopMs: 5000,
    routing: [
      { group: 'maintenance', kinds: ['mttr-breach', 'micro-stop'], oncall: ['tech1','tech2'], escalateAfterMin: 30 },
      { group: 'production', kinds: ['performance-dip','fpy-drop','order-at-risk'], oncall: ['sup1'] },
      { group: 'energy', kinds: ['energy-spike'], oncall: ['eng1'] },
    ],
  };
  return safeGet<AlertPolicy>('/alerts/policy', fallback);
}

export async function saveAlertPolicy(p: AlertPolicy): Promise<{ success: boolean }>{
  localStorage.setItem('but.alerts.policy', JSON.stringify(p));
  return safePost('/alerts/policy', p, { success: true });
}

export async function listAlerts(): Promise<Alert[]> {
  const fallback: Alert[] = [
    { id: 'a1', kind: 'performance-dip', severity: 'warning', line: 'Line 1', happenedAt: new Date().toISOString(), message: 'Performance −12% vs baseline (15min)' },
    { id: 'a2', kind: 'mttr-breach', severity: 'critical', machineId: 'M-02', happenedAt: new Date(Date.now()-20*60*1000).toISOString(), message: 'MTTR > 30m on M-02' },
    { id: 'a3', kind: 'order-at-risk', severity: 'warning', orderId: 'WO-2024-002', happenedAt: new Date().toISOString(), message: 'Order WO-2024-002 at risk due to rate loss' },
  ];
  return safeGet<Alert[]>('/alerts', fallback);
}

export async function ackAlert(id: string): Promise<{ success: boolean }>{
  return safePost(`/alerts/${encodeURIComponent(id)}/ack`, {}, { success: true });
}

export async function routeAlert(id: string, group: string): Promise<{ success: boolean }>{
  return safePost(`/alerts/${encodeURIComponent(id)}/route`, { group }, { success: true });
}

export async function escalateAlert(id: string): Promise<{ success: boolean }>{
  return safePost(`/alerts/${encodeURIComponent(id)}/escalate`, {}, { success: true });
}
