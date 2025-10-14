// Maintenance & PdM: condition streams, RUL, failure modes, maintenance timeline, MTBF/MTTR, and OEE impact

export type ConditionSample = {
  t: string;
  vibration_g: number;
  temperature_c: number;
  amperage_a: number;
};

export type AssetConditionSeries = {
  assetId: string;
  samples: ConditionSample[];
};

export type RemainingUsefulLife = {
  assetId: string;
  predictedHours: number;
  confidence: number; // 0..1
  status: 'normal' | 'warning' | 'critical';
};

export type FailureMode = {
  id: string;
  name: string;
  signals: Array<'vibration' | 'temperature' | 'amperage'>;
  probableCauses: string[];
  standardFixes: string[];
};

export type MaintenanceEvent = {
  assetId: string;
  kind: 'service' | 'failure' | 'repair' | 'inspection';
  at: string;
  notes?: string;
};

export type ReliabilityTrends = {
  labels: string[]; // e.g., weeks
  mtbfHours: number[];
  mttrHours: number[];
};

export type OeeImpact = {
  assetId: string;
  availabilityDelta: number; // +/- points
  performanceDelta: number;
  qualityDelta: number;
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

export async function getConditionSeries(assetIds: string[]): Promise<AssetConditionSeries[]> {
  const now = Date.now();
  const mkSeries = (assetId: string): AssetConditionSeries => ({
    assetId,
    samples: Array.from({ length: 60 }).map((_, i) => ({
      t: new Date(now - (59 - i) * 60000).toISOString(),
      vibration_g: 0.9 + Math.random() * 0.4,
      temperature_c: 52 + Math.random() * 6,
      amperage_a: 7 + Math.random() * 2,
    })),
  });
  const fallback = assetIds.map(mkSeries);
  return safeGet(`/maintenance/conditions?assets=${encodeURIComponent(assetIds.join(','))}`, fallback);
}

export async function getRemainingUsefulLife(assetIds: string[]): Promise<RemainingUsefulLife[]> {
  const fallback: RemainingUsefulLife[] = assetIds.map((id) => {
    const predictedHours = Math.floor(80 + Math.random() * 200);
    const confidence = 0.7 + Math.random() * 0.25;
    const status: RemainingUsefulLife['status'] = predictedHours < 100 ? (predictedHours < 60 ? 'critical' : 'warning') : 'normal';
    return { assetId: id, predictedHours, confidence: Number(confidence.toFixed(2)), status };
  });
  return safeGet(`/maintenance/rul?assets=${encodeURIComponent(assetIds.join(','))}`, fallback);
}

export async function listFailureModes(assetType = 'default'): Promise<FailureMode[]> {
  const fallback: FailureMode[] = [
    {
      id: 'fm1',
      name: 'Bearing wear',
      signals: ['vibration', 'temperature'],
      probableCauses: ['Insufficient lubrication', 'Contamination'],
      standardFixes: ['Lubricate bearings', 'Replace bearing', 'Check seals and clean'],
    },
    {
      id: 'fm2',
      name: 'Motor overload',
      signals: ['amperage', 'temperature'],
      probableCauses: ['Over-tensioned belts', 'Jammed mechanism'],
      standardFixes: ['Adjust belt tension', 'Inspect gearbox & remove debris'],
    },
  ];
  return safeGet(`/maintenance/failure-modes?type=${encodeURIComponent(assetType)}`, fallback);
}

export async function getMaintenanceTimeline(assetId: string): Promise<MaintenanceEvent[]> {
  const now = Date.now();
  const fallback: MaintenanceEvent[] = [
    { assetId, kind: 'inspection', at: new Date(now - 7 * 24 * 3600e3).toISOString(), notes: 'Weekly check OK' },
    { assetId, kind: 'service', at: new Date(now - 30 * 24 * 3600e3).toISOString(), notes: 'Replaced filter and oil' },
    { assetId, kind: 'failure', at: new Date(now - 45 * 24 * 3600e3).toISOString(), notes: 'Minor jam cleared' },
  ];
  return safeGet(`/maintenance/timeline/${encodeURIComponent(assetId)}`, fallback);
}

export async function getReliabilityTrends(assetId: string): Promise<ReliabilityTrends> {
  const labels = Array.from({ length: 12 }).map((_, i) => `W${i + 1}`);
  const mtbfHours = labels.map(() => 120 + Math.floor(Math.random() * 40));
  const mttrHours = labels.map(() => 2 + Math.random() * 1.5);
  const fallback: ReliabilityTrends = { labels, mtbfHours, mttrHours: mttrHours.map((x) => Number(x.toFixed(2))) };
  return safeGet(`/maintenance/reliability/${encodeURIComponent(assetId)}`, fallback);
}

export async function getMaintenanceImpact(assetId: string): Promise<OeeImpact> {
  const fallback: OeeImpact = {
    assetId,
    availabilityDelta: -1.2,
    performanceDelta: -0.8,
    qualityDelta: -0.3,
  };
  return safeGet(`/maintenance/impact/${encodeURIComponent(assetId)}`, fallback);
}
