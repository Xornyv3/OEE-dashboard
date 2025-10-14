// Quality & traceability: FPY, scrap & rework, SPC/vision hooks, and end-to-end e-traceability

export type FpyKpis = {
  fpyPct: number;
  scrapPct: number;
  reworkPct: number;
  horizon: 'shift' | 'day' | 'week';
};

export type ScrapReason = { reason: string; count: number; lot?: string; tool?: string; cavity?: string; operator?: string };

export type SpcSample = { t: string; value: number; ucl: number; lcl: number; cl: number };

export type VisionHeatCell = { x: number; y: number; density: number };

export type TraceHop = { type: 'material' | 'machine' | 'order' | 'operator' | 'customer'; id: string; label: string; at?: string };

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

export async function getFpyKpis(scope: 'shift' | 'day' | 'week' = 'shift'): Promise<FpyKpis> {
  const fallback: FpyKpis = { fpyPct: 96.8, scrapPct: 2.1, reworkPct: 1.1, horizon: scope };
  return safeGet(`/quality/fpy?k=${scope}`, fallback);
}

export async function listScrapReasons(horizon: 'shift' | 'day' | 'week' = 'shift'): Promise<ScrapReason[]> {
  const fallback: ScrapReason[] = [
    { reason: 'Short shot', count: 18, cavity: 'C2' },
    { reason: 'Flash', count: 12, cavity: 'C4', operator: 'OP-12' },
    { reason: 'Warp', count: 8, lot: 'LOT-8841' },
  ];
  return safeGet(`/quality/scrap?h=${horizon}`, fallback);
}

export async function getSpcSeries(feature = 'length'): Promise<SpcSample[]> {
  const cl = 10.0;
  const ucl = 10.5;
  const lcl = 9.5;
  const now = Date.now();
  const fallback: SpcSample[] = Array.from({ length: 50 }).map((_, i) => ({
    t: new Date(now - (49 - i) * 60000).toISOString(),
    value: cl + (Math.random() - 0.5) * 0.6,
    ucl,
    lcl,
    cl,
  }));
  return safeGet(`/quality/spc?f=${encodeURIComponent(feature)}`, fallback);
}

export async function getVisionHeatmap(): Promise<VisionHeatCell[]> {
  const fallback: VisionHeatCell[] = Array.from({ length: 200 }).map(() => ({
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 10),
    density: Math.random(),
  }));
  return safeGet('/quality/vision-heatmap', fallback);
}

export async function tracePathFromMaterial(lotId: string): Promise<TraceHop[]> {
  const now = Date.now();
  const fallback: TraceHop[] = [
    { type: 'material', id: lotId, label: lotId },
    { type: 'machine', id: 'M-02', label: 'Lathe B', at: new Date(now - 3600e3).toISOString() },
    { type: 'order', id: 'WO-2024-003', label: 'WO-2024-003' },
    { type: 'customer', id: 'CUST-145', label: 'ACME Aerospace' },
  ];
  return safeGet(`/quality/trace/material/${encodeURIComponent(lotId)}`, fallback);
}
