// Data capture & integrity controls with offline-first stubs.
// Enforces non-cheat by design: automatic capture, validation, audit, taxonomy, watchdogs.

export type Connector =
  | { kind: "opcua"; endpoint: string; username?: string; nodeIds: string[] }
  | { kind: "mqtt"; brokerUrl: string; topic: string; clientId?: string };

export type IntegrityPolicy = {
  manualCountsDisabled: boolean; // disallow manual runtime/output counts
  requireTwoPersonApproval: boolean; // for KPI-impacting changes
  dualSourceValidationEnabled: boolean;
};

export type AuditEntry = {
  id: string;
  when: string; // ISO
  who: string; // user id or name
  action: string; // e.g., "OVERRIDE_KPI", "EDIT_TAXONOMY"
  why?: string;
  details?: Record<string, unknown>;
  approval?: { approver?: string; status: "pending" | "approved" | "rejected" };
};

export type LossCode = { code: string; label: string; category: "SixBigLoss" | "Other" };
export type Taxonomy = { version: string; changedAt: string; changedBy: string; notes?: string; codes: LossCode[] };

export type WatchdogRule = {
  id: string;
  name: string;
  condition: string; // DSL e.g., speed>max*1.2 OR zeroScrapShift
  severity: "info" | "warning" | "critical";
  enabled: boolean;
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

// Connectors
export async function getConnectors(): Promise<Connector[]> {
  const fallback: Connector[] = [
    { kind: "opcua", endpoint: "opc.tcp://plc.example.local:4840", nodeIds: ["ns=2;s=CycleCount", "ns=2;s=Current"] },
    { kind: "mqtt", brokerUrl: "mqtt://broker.example.local:1883", topic: "factory/line1/#" },
  ];
  return safeGet<Connector[]>("/integrity/connectors", fallback);
}

export async function saveConnectors(c: Connector[]): Promise<{ success: boolean }>{
  return safePost("/integrity/connectors", c, { success: true });
}

// Policy
export async function getIntegrityPolicy(): Promise<IntegrityPolicy> {
  const local = localStorage.getItem("but.integrity.policy");
  const fallback: IntegrityPolicy = local ? JSON.parse(local) : {
    manualCountsDisabled: true,
    requireTwoPersonApproval: true,
    dualSourceValidationEnabled: true,
  };
  return safeGet<IntegrityPolicy>("/integrity/policy", fallback);
}

export async function saveIntegrityPolicy(p: IntegrityPolicy): Promise<{ success: boolean }>{
  localStorage.setItem("but.integrity.policy", JSON.stringify(p));
  return safePost("/integrity/policy", p, { success: true });
}

// Audit trail (append-only)
export async function listAuditEntries(): Promise<AuditEntry[]> {
  const local = localStorage.getItem("but.integrity.audit");
  const fallback: AuditEntry[] = local ? JSON.parse(local) : [];
  return safeGet<AuditEntry[]>("/integrity/audit", fallback);
}

export async function appendAuditEntry(entry: Omit<AuditEntry, "id" | "when"> & { when?: string }): Promise<{ success: boolean; id: string }>{
  const record: AuditEntry = { id: crypto.randomUUID(), when: entry.when ?? new Date().toISOString(), ...entry } as AuditEntry;
  const existing = await listAuditEntries();
  const updated = [record, ...existing];
  localStorage.setItem("but.integrity.audit", JSON.stringify(updated));
  return safePost("/integrity/audit", record, { success: true, id: record.id });
}

// Loss taxonomy (versioned KPI dictionary)
export async function getTaxonomy(): Promise<Taxonomy> {
  const local = localStorage.getItem("but.integrity.taxonomy");
  const fallback: Taxonomy = local ? JSON.parse(local) : {
    version: "v1",
    changedAt: new Date().toISOString(),
    changedBy: "system",
    notes: "Initial Six Big Losses",
    codes: [
      { code: "1", label: "Equipment Failure", category: "SixBigLoss" },
      { code: "2", label: "Setup and Adjustments", category: "SixBigLoss" },
      { code: "3", label: "Idling and Minor Stops", category: "SixBigLoss" },
      { code: "4", label: "Reduced Speed", category: "SixBigLoss" },
      { code: "5", label: "Process Defects", category: "SixBigLoss" },
      { code: "6", label: "Reduced Yield", category: "SixBigLoss" },
    ],
  };
  return safeGet<Taxonomy>("/integrity/taxonomy", fallback);
}

export async function saveTaxonomy(t: Taxonomy): Promise<{ success: boolean }>{
  // bump version locally for demo
  const bumped = { ...t, version: `v${Number((t.version||"v1").replace(/\D/g, "")) + 1}`, changedAt: new Date().toISOString() };
  localStorage.setItem("but.integrity.taxonomy", JSON.stringify(bumped));
  return safePost("/integrity/taxonomy", bumped, { success: true });
}

// Watchdogs
export async function getWatchdogs(): Promise<WatchdogRule[]> {
  const local = localStorage.getItem("but.integrity.watchdogs");
  const fallback: WatchdogRule[] = local ? JSON.parse(local) : [
    { id: "w1", name: "Impossible speed", condition: "speed>max*1.2", severity: "critical", enabled: true },
    { id: "w2", name: "Zero scrap shift", condition: "scrap==0 for 8h", severity: "warning", enabled: true },
    { id: "w3", name: "Time gap", condition: "gap(data)>2m", severity: "warning", enabled: true },
    { id: "w4", name: "Clock skew", condition: "abs(plc_clock-now)>60s", severity: "info", enabled: true },
  ];
  return safeGet<WatchdogRule[]>("/integrity/watchdogs", fallback);
}

export async function saveWatchdogs(list: WatchdogRule[]): Promise<{ success: boolean }>{
  localStorage.setItem("but.integrity.watchdogs", JSON.stringify(list));
  return safePost("/integrity/watchdogs", list, { success: true });
}

// Dual-source validation
export function validateDualSource(sample: { cycleCount: number; currentAmps?: number; powerWatts?: number }): { valid: boolean; reason?: string }{
  if (!sample) return { valid: false, reason: "missing" };
  // very rough heuristic: if cycleCount>0 require either current or power above minimal threshold
  if (sample.cycleCount > 0 && (sample.currentAmps ?? 0) < 0.1 && (sample.powerWatts ?? 0) < 5) {
    return { valid: false, reason: "No electrical load with positive cycles" };
  }
  return { valid: true };
}
