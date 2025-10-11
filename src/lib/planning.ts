// Planning & Scheduling client with offline stubs.
// Goal: plan machine orders by worker shifts and work-order articles/components.

export type Article = {
  id: string;
  name: string;
  components: Array<{ id: string; name: string; machineType: string }>;
};

export type Machine = { id: string; name: string; type?: string; line?: string };

export type ShiftSlot = { name: string; start: string; end: string };

export type Assignment = {
  id: string;
  date: string; // YYYY-MM-DD
  shift: string; // ShiftSlot.name
  machineId: string;
  articleId: string;
  componentId?: string;
  quantity: number;
  operatorId?: string;
  notes?: string;
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
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function fetchArticles(): Promise<Article[]> {
  const fallback: Article[] = [
    {
      id: "PEN-A",
      name: "Ballpoint Pen A",
      components: [
        { id: "crystal", name: "Crystal Container", machineType: "molder" },
        { id: "buchon", name: "Cap (Bouchon)", machineType: "press" },
        { id: "ink", name: "Ink Container", machineType: "assembly" },
      ],
    },
    {
      id: "PEN-B",
      name: "Gel Pen B",
      components: [
        { id: "barrel", name: "Barrel", machineType: "molder" },
        { id: "grip", name: "Grip", machineType: "molder" },
        { id: "tip", name: "Tip", machineType: "lathe" },
      ],
    },
  ];
  return safeGet<Article[]>("/planning/articles", fallback);
}

export async function fetchMachines(): Promise<Machine[]> {
  const fallback: Machine[] = [
    { id: "M-01", name: "Molder A", type: "molder", line: "Line 1" },
    { id: "M-02", name: "Press B", type: "press", line: "Line 1" },
    { id: "M-03", name: "Assembly C", type: "assembly", line: "Line 2" },
    { id: "M-04", name: "Lathe D", type: "lathe", line: "Line 2" },
  ];
  return safeGet<Machine[]>("/planning/machines", fallback);
}

export async function fetchShiftSlots(): Promise<ShiftSlot[]> {
  const fallback: ShiftSlot[] = [
    { name: "Morning", start: "06:00", end: "14:00" },
    { name: "Afternoon", start: "14:00", end: "22:00" },
    { name: "Night", start: "22:00", end: "06:00" },
  ];
  return safeGet<ShiftSlot[]>("/planning/shifts", fallback);
}

export async function fetchAssignments(date: string): Promise<Assignment[]> {
  const fallback: Assignment[] = [
    { id: "A-1", date, shift: "Morning", machineId: "M-01", articleId: "PEN-A", componentId: "crystal", quantity: 500, operatorId: "op1" },
    { id: "A-2", date, shift: "Morning", machineId: "M-02", articleId: "PEN-A", componentId: "buchon", quantity: 500, operatorId: "op2" },
    { id: "A-3", date, shift: "Afternoon", machineId: "M-03", articleId: "PEN-A", componentId: "ink", quantity: 500 },
  ];
  return safeGet<Assignment[]>(`/planning/assignments?date=${encodeURIComponent(date)}`, fallback);
}

export async function saveAssignment(a: Omit<Assignment, "id"> & { id?: string }): Promise<{ success: boolean; id: string }>
{
  const fallback = { success: true, id: a.id ?? `A-${Math.random().toString(36).slice(2, 8)}` };
  return safePost<{ success: boolean; id: string }>("/planning/assignments", a, fallback);
}

export async function deleteAssignment(id: string): Promise<{ success: boolean }>{
  const fallback = { success: true };
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}/planning/assignments/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return { success: true };
  } catch {
    return fallback;
  }
}
