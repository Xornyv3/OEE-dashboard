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

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

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
  const fallback: ProductionCounts = { total: 1250, good: 1190, scrap: 60, ratePerHour: 210 };
  return safeFetch<ProductionCounts>("/realtime/counts", fallback);
}
