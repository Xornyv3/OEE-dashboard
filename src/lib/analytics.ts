// Advanced analytics & AI: root-cause discovery, prescriptive plays, what-if simulator, dynamic targets

export type Contribution = { factor: string; impactPoints: number; shap?: number };
export type RootCauseInsight = { loss: string; estimatedPoints: number; contributions: Contribution[] };

export type PrescriptivePlay = { id: string; action: string; expectedDeltaOee: number; confidence: number };

export type WhatIfInput = {
  crew: number; // operators
  speedPct: number; // relative to standard
  sequence?: string[]; // product/order sequence IDs
  maintenanceAt?: string; // ISO time
};

export type WhatIfResult = { predictedOee: number; details: Array<{ factor: string; deltaPoints: number }> };

export type DynamicTarget = { scope: 'product' | 'shift' | 'environment'; key: string; oeeTarget: number; lastUpdated: string };

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

export async function getRootCauseInsights(horizon: 'shift' | 'day' | 'week' = 'shift'): Promise<RootCauseInsight[]> {
  const fallback: RootCauseInsight[] = [
    { loss: 'Changeover duration', estimatedPoints: 2.3, contributions: [
      { factor: 'Product mix volatility', impactPoints: 1.2, shap: 0.4 },
      { factor: 'Crew experience', impactPoints: 0.8, shap: 0.35 },
    ]},
    { loss: 'Minor stops', estimatedPoints: 1.6, contributions: [
      { factor: 'Sensor false triggers', impactPoints: 0.9, shap: 0.3 },
      { factor: 'Material variability', impactPoints: 0.5, shap: 0.2 },
    ]},
  ];
  return safeGet(`/analytics/root-causes?h=${horizon}`, fallback);
}

export async function listPrescriptivePlays(): Promise<PrescriptivePlay[]> {
  const fallback: PrescriptivePlay[] = [
    { id: 'play1', action: 'Reduce changeover by 6 min', expectedDeltaOee: 3.1, confidence: 0.72 },
    { id: 'play2', action: 'Increase sensor debounce by 30ms', expectedDeltaOee: 0.8, confidence: 0.64 },
  ];
  return safeGet('/analytics/plays', fallback);
}

export async function simulateWhatIf(input: WhatIfInput): Promise<WhatIfResult> {
  const base = 78 + Math.random() * 6;
  const delta = (input.speedPct - 100) * 0.05 + (input.crew - 3) * 0.4 + (input.maintenanceAt ? 0.6 : 0);
  const predicted = Math.max(60, Math.min(95, base + delta));
  const fallback: WhatIfResult = {
    predictedOee: Number(predicted.toFixed(1)),
    details: [
      { factor: 'Speed change', deltaPoints: Number(((input.speedPct - 100) * 0.05).toFixed(2)) },
      { factor: 'Crew level', deltaPoints: Number(((input.crew - 3) * 0.4).toFixed(2)) },
      { factor: 'Maintenance timing', deltaPoints: input.maintenanceAt ? 0.6 : 0 },
    ],
  };
  return safePost('/analytics/what-if', input, fallback);
}

export async function getDynamicTargets(): Promise<DynamicTarget[]> {
  const fallback: DynamicTarget[] = [
    { scope: 'product', key: 'SKU-1001', oeeTarget: 82.5, lastUpdated: new Date().toISOString() },
    { scope: 'shift', key: 'Shift A', oeeTarget: 79.0, lastUpdated: new Date().toISOString() },
    { scope: 'environment', key: 'High humidity', oeeTarget: 77.5, lastUpdated: new Date().toISOString() },
  ];
  return safeGet('/analytics/targets', fallback);
}
