export type DatabaseInfo = {
  description: string;
  status: "connected" | "degraded" | "disconnected";
  lastUpdate: string; // ISO or display string
};

export type ActiveUser = {
  id: string;
  name: string;
  role: string;
  email?: string;
  lastSeen: string;
};

import { getApiBase } from './utils';
const API_BASE = getApiBase();

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

export async function getDatabaseInfo(): Promise<DatabaseInfo> {
  const fallback: DatabaseInfo = {
    description: "Local development database",
    status: "connected",
    lastUpdate: new Date().toISOString(),
  };
  return safeFetch<DatabaseInfo>("/system/database-info", fallback);
}

export async function getActiveUsers(): Promise<ActiveUser[]> {
  const fallback: ActiveUser[] = [
    { id: "u1", name: "Jane Doe", role: "Operator", email: "jane@example.com", lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: "u2", name: "John Smith", role: "Supervisor", email: "john@example.com", lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: "u3", name: "Alex Lee", role: "Engineer", email: "alex@example.com", lastSeen: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  ];
  return safeFetch<ActiveUser[]>("/system/active-users", fallback);
}

export function formatRelative(ts: string): string {
  try {
    const d = new Date(ts);
    const diff = Date.now() - d.getTime();
    const mins = Math.max(0, Math.floor(diff / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return ts;
  }
}
