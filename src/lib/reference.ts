// Reference study benchmarks: store and retrieve KPI targets derived from an external study (PDF, etc.)

export type StudyBenchmark = {
  // Global defaults; more granular overrides may appear in maps below
  oeeTargetPct?: number; // e.g., 85
  fpyTargetPct?: number; // e.g., 98
  kwhPerGoodTarget?: number; // e.g., 0.8
  mttrTargetHours?: number; // e.g., 1.0
  mtbfTargetHours?: number; // e.g., 120
  co2PerOrderTargetKg?: number; // optional average
  // Optional scoped benchmarks
  byProduct?: Record<string, Partial<StudyBenchmark>>;
  byShift?: Record<string, Partial<StudyBenchmark>>;
  byLine?: Record<string, Partial<StudyBenchmark>>;
  updatedAt?: string;
  source?: string; // study name or URL
};

const LS_KEY = 'but.reference.study';
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

export async function getReferenceStudy(): Promise<StudyBenchmark> {
  const local = localStorage.getItem(LS_KEY);
  const fallback: StudyBenchmark = local
    ? JSON.parse(local)
    : {
        oeeTargetPct: 85,
        fpyTargetPct: 98,
        kwhPerGoodTarget: 0.9,
        mttrTargetHours: 1,
        mtbfTargetHours: 120,
        source: 'External Study (imported)',
        updatedAt: new Date().toISOString(),
      };
  return safeGet('/reference/study', fallback);
}

export async function saveReferenceStudy(bm: StudyBenchmark): Promise<{ success: boolean }>{
  localStorage.setItem(LS_KEY, JSON.stringify({ ...bm, updatedAt: new Date().toISOString() }));
  // Best-effort post; ignore failures in offline mode
  if (!API_BASE) return { success: true };
  try {
    const res = await fetch(`${API_BASE}/reference/study`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bm) });
    if (!res.ok) throw new Error('http');
    return { success: true };
  } catch {
    return { success: true };
  }
}

export function pickScopedBenchmark(bm: StudyBenchmark, scope?: { product?: string; shift?: string; line?: string }): StudyBenchmark {
  if (!scope) return bm;
  const merged: StudyBenchmark = { ...bm };
  if (scope.product && bm.byProduct?.[scope.product]) Object.assign(merged, bm.byProduct[scope.product]);
  if (scope.shift && bm.byShift?.[scope.shift]) Object.assign(merged, bm.byShift[scope.shift]);
  if (scope.line && bm.byLine?.[scope.line]) Object.assign(merged, bm.byLine[scope.line]);
  return merged;
}
