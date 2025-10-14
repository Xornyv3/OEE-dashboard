import { getApiBase } from './utils';
import { fetchDemoDataset } from './demo';
const API_BASE = getApiBase();
function lForMachine(demo: any, machineId: string): string | undefined {
  return demo.production?.lines?.find((ln: any) => ln.machines.some((m: any) => m.id === machineId))?.lineId;
}
export type MachineStatus = {
  id: string;
  name: string;
  on: boolean;
  line?: string;
};

export type OperatorAssignment = {
  machineId: string;
  operator: string;
  role?: string;
};

export type ShiftProgress = {
  shiftName: string;
  startedAt: string;
  endsAt: string;
  percent: number;
};

export type WorkOrderProgress = {
  id: string;
  product: string;
  planned: number;
  completed: number;
  percent: number;
};

export type DowntimeAlert = {
  id: string;
  machineId: string;
  reason: string;
  startedAt: string;
  severity: "low" | "medium" | "high";
};

export type ProductionCounts = {
  total: number;
  good: number;
  scrap: number;
  ratePerHour?: number;
};

export type MinuteOee = { minute: string; availability: number; performance: number; quality: number; oee: number };
export type MicroStop = { machineId: string; startedAt: string; durationMs: number; reason?: string };
export type HeatCell = { hour: number; asset: string; oee: number };

export type MachinePerformanceDataset = {
  generatedAt: string;
  lines: Array<{
    lineId: string;
    targetPerHour: number;
    machines: Array<{
      id: string; name: string; good: number; scrap: number; rework: number; energyKWh: number; efficiency: number; availability: number; performance: number; quality: number;
    }>;
  }>;
  hourly: Array<{ hour: string; count: number; energy: number }>;
};

// API_BASE resolved above via getApiBase()

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    return data;
  } catch (e) {
    return fallback;
  }
}

export async function getMachineStatuses(): Promise<MachineStatus[]> {
  const demo = await fetchDemoDataset();
  if (demo.production?.lines?.length) {
    return demo.production.lines.flatMap(l => l.machines).map(m => ({ id: m.id, name: m.name, on: m.efficiency > 0, line: lForMachine(demo, m.id) }));
  }
  const fallback: MachineStatus[] = [
    { id: "M-01", name: "CNC Mill A", on: true, line: "Line 1" },
    { id: "M-02", name: "Lathe B", on: false, line: "Line 1" },
    { id: "M-03", name: "Robot Arm C", on: true, line: "Line 2" },
  ];
  return safeFetch<MachineStatus[]>("/realtime/machines", fallback);
}

export async function getOperatorAssignments(): Promise<OperatorAssignment[]> {
  const fallback: OperatorAssignment[] = [
    { machineId: "M-01", operator: "Jane Doe", role: "Operator" },
    { machineId: "M-02", operator: "John Smith", role: "Operator" },
    { machineId: "M-03", operator: "Alex Lee", role: "Technician" },
  ];
  return safeFetch<OperatorAssignment[]>("/realtime/operators", fallback);
}

export async function getShiftProgress(): Promise<ShiftProgress> {
  const now = new Date();
  const start = new Date(now);
  start.setHours(6, 0, 0, 0);
  const end = new Date(now);
  end.setHours(14, 0, 0, 0);
  const percent = Math.min(100, Math.max(0, Math.floor(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)));
  const fallback: ShiftProgress = { shiftName: "Shift A", startedAt: start.toISOString(), endsAt: end.toISOString(), percent };
  return safeFetch<ShiftProgress>("/realtime/shift", fallback);
}

export async function getTopWorkOrders(): Promise<WorkOrderProgress[]> {
  const fallback: WorkOrderProgress[] = [
    { id: "WO-2024-001", product: "Engine Block A1", planned: 500, completed: 380, percent: 76 },
    { id: "WO-2024-002", product: "Transmission Case B2", planned: 300, completed: 0, percent: 0 },
  ];
  return safeFetch<WorkOrderProgress[]>("/realtime/workorders", fallback);
}

export async function getDowntimeAlerts(): Promise<DowntimeAlert[]> {
  const fallback: DowntimeAlert[] = [
    { id: "DT-9001", machineId: "M-02", reason: "Emergency stop pressed", startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), severity: "high" },
  ];
  return safeFetch<DowntimeAlert[]>("/realtime/downtime", fallback);
}

export async function getProductionCounts(): Promise<ProductionCounts> {
  const demo = await fetchDemoDataset();
  if (demo.production?.lines?.length) {
    const all = demo.production.lines.flatMap(l => l.machines);
    const good = all.reduce((s,m)=> s + m.good,0);
    const scrap = all.reduce((s,m)=> s + m.scrap,0);
    return { total: good + scrap, good, scrap, ratePerHour: Math.round(good / 8) };
  }
  const fallback: ProductionCounts = { total: 1250, good: 1190, scrap: 60, ratePerHour: 210 };
  return safeFetch<ProductionCounts>("/realtime/counts", fallback);
}

export async function getMinuteOee(line = "Line 1"): Promise<MinuteOee[]> {
  const demo = await fetchDemoDataset();
  if (demo.production?.hourly?.length) {
    // Simulate OEE components derived from hourly counts
    return demo.production.hourly.map(h => {
      const availability = 85 + Math.floor(Math.random()*5);
      const performance = 80 + Math.floor(Math.random()*8);
      const quality = 95 + Math.floor(Math.random()*3);
      const oee = Math.round((availability/100)*(performance/100)*(quality/100)*100);
      return { minute: h.hour, availability, performance, quality, oee };
    });
  }
  const now = new Date();
  const fallback: MinuteOee[] = Array.from({ length: 60 }).map((_, i) => {
    const d = new Date(now.getTime() - (59 - i) * 60000);
    const a = 85 + Math.floor(Math.random() * 5);
    const p = 80 + Math.floor(Math.random() * 8);
    const q = 95 + Math.floor(Math.random() * 3);
    const o = Math.round((a / 100) * (p / 100) * (q / 100) * 100);
    return { minute: d.toISOString().slice(11, 16), availability: a, performance: p, quality: q, oee: o };
  });
  return safeFetch<MinuteOee[]>(`/realtime/minute-oee?line=${encodeURIComponent(line)}`, fallback);
}

export async function getMicroStops(line = "Line 1"): Promise<MicroStop[]> {
  const demo = await fetchDemoDataset();
  if (demo.production?.lines?.length) {
    const machines = demo.production.lines.flatMap(l => l.machines).slice(0,3);
    return machines.map(m => ({ machineId: m.id, startedAt: new Date(Date.now() - Math.random()*3600e3).toISOString(), durationMs: 3000 + Math.floor(Math.random()*4000), reason: 'Demo micro stop' }));
  }
  const fallback: MicroStop[] = [
    { machineId: "M-01", startedAt: new Date(Date.now() - 120000).toISOString(), durationMs: 4000, reason: "Sensor block" },
    { machineId: "M-03", startedAt: new Date(Date.now() - 360000).toISOString(), durationMs: 6000 },
  ];
  return safeFetch<MicroStop[]>(`/realtime/micro-stops?line=${encodeURIComponent(line)}`, fallback);
}

export async function getOeeHeatmap(line = "Line 1"): Promise<HeatCell[]> {
  const demo = await fetchDemoDataset();
  if (demo.production?.lines?.length) {
    const assets = demo.production.lines.flatMap(l => l.machines).map(m => m.id).slice(0,4);
    const out: HeatCell[] = Array.from({ length: 24 * assets.length }).map((_, idx) => ({
      hour: Math.floor(idx / assets.length),
      asset: assets[idx % assets.length],
      oee: 70 + Math.floor(Math.random()*25),
    }));
    return out;
  }
  const assets = ["M-01", "M-02", "M-03", "M-04"];
  const fallback: HeatCell[] = Array.from({ length: 24 * assets.length }).map((_, idx) => ({
    hour: Math.floor(idx / assets.length),
    asset: assets[idx % assets.length],
    oee: 70 + Math.floor(Math.random() * 25),
  }));
  return safeFetch<HeatCell[]>(`/realtime/heatmap?line=${encodeURIComponent(line)}`, fallback);
}

export async function getMachinePerformance(): Promise<MachinePerformanceDataset> {
  const now = new Date().toISOString();
  const fallback: MachinePerformanceDataset = {
    generatedAt: now,
    lines: [
      {
        lineId: 'Line 1',
        targetPerHour: 700,
        machines: [
          { id: 'M-01', name: 'Demo Machine', good: 1000, scrap: 50, rework: 20, energyKWh: 120, efficiency: 90, availability: 90, performance: 92, quality: 96 }
        ]
      }
    ],
    hourly: Array.from({ length: 12 }).map((_, i) => ({ hour: String(i).padStart(2,'0')+':00', count: 500 + i*5, energy: 200 + i*3 }))
  };
  return safeFetch<MachinePerformanceDataset>('/realtime/machine-performance', fallback);
}
