import { getApiBase } from './utils';

const API_BASE = getApiBase();

// === Unified Demo Dataset Types ===
export interface DemoOperator { id: string; name: string; role: string; shift: string; }
export interface DemoMachine { id: string; name: string; type?: string; good: number; scrap: number; rework: number; energyKWh: number; efficiency: number; availability: number; performance: number; quality: number; }
export interface DemoLine { lineId: string; targetPerHour: number; oeeTarget?: number; machines: DemoMachine[]; }
export interface DemoHourlyPoint { hour: string; count: number; energy: number; }
export interface DemoArticleComponent { id: string; name: string; machineType: string; }
export interface DemoArticle { id: string; name: string; components: DemoArticleComponent[]; }
export interface DemoShift { name: string; start: string; end: string; }
export interface DemoAssignment { id: string; date: string; shift: string; machineId: string; articleId: string; componentId?: string; quantity: number; operatorId?: string; }
export interface DemoScrapReason { reason: string; count: number; cavity?: string; lot?: string; operator?: string; }
export interface DemoFailureMode { id: string; name: string; signals: string[]; probableCauses: string[]; standardFixes: string[]; }
export interface DemoRootCauseContribution { factor: string; impactPoints: number; shap?: number; }
export interface DemoRootCause { loss: string; estimatedPoints: number; contributions: DemoRootCauseContribution[]; }

export interface DemoDataset {
  generatedAt: string;
  people?: { operators: DemoOperator[] };
  production?: { lines: DemoLine[]; hourly: DemoHourlyPoint[] };
  planning?: { articles: DemoArticle[]; shifts: DemoShift[]; assignments: DemoAssignment[] };
  quality?: { fpy?: { shift?: { fpyPct: number; scrapPct: number; reworkPct: number } }; scrapReasons?: DemoScrapReason[] };
  maintenance?: { failureModes: DemoFailureMode[] };
  analytics?: { rootCauses: DemoRootCause[] };
}

let cached: DemoDataset | null = null;

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json() as T;
  } catch {
    return fallback;
  }
}

export async function fetchDemoDataset(): Promise<DemoDataset> {
  if (cached) return cached;
  const fallback: DemoDataset = {
    generatedAt: new Date().toISOString(),
    production: { lines: [], hourly: [] },
  };
  cached = await safeFetch('/realtime/demo-dataset', fallback);
  return cached;
}

// Slice helpers
export async function demoLines() { return (await fetchDemoDataset()).production?.lines || []; }
export async function demoHourly() { return (await fetchDemoDataset()).production?.hourly || []; }
export async function demoOperators() { return (await fetchDemoDataset()).people?.operators || []; }
export async function demoArticles() { return (await fetchDemoDataset()).planning?.articles || []; }
export async function demoShifts() { return (await fetchDemoDataset()).planning?.shifts || []; }
export async function demoAssignments(date?: string) { return (await fetchDemoDataset()).planning?.assignments.filter(a => !date || a.date === date) || []; }
export async function demoScrapReasons() { return (await fetchDemoDataset()).quality?.scrapReasons || []; }
export async function demoFailureModes() { return (await fetchDemoDataset()).maintenance?.failureModes || []; }
export async function demoRootCauses() { return (await fetchDemoDataset()).analytics?.rootCauses || []; }
