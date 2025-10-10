// Lightweight ERPNext client with safe fallbacks
// Configure these environment variables in a .env file (Vite):
// VITE_ERP_BASE_URL=https://your-erpnext.example.com
// VITE_ERP_API_KEY=your_api_key
// VITE_ERP_API_SECRET=your_api_secret

export type ShiftInfo = {
  name: string;
  start: string; // HH:mm
  end: string;   // HH:mm
  breakMinutes?: number;
};

export type ItemDetails = {
  name: string;
  description?: string;
  dimensions?: string;
  weight?: string;
  uom?: string;
  imageUrl?: string;
};

const BASE_URL = (import.meta as any).env?.VITE_ERP_BASE_URL as string | undefined;
const API_KEY = (import.meta as any).env?.VITE_ERP_API_KEY as string | undefined;
const API_SECRET = (import.meta as any).env?.VITE_ERP_API_SECRET as string | undefined;

function isConfigured() {
  return Boolean(BASE_URL && API_KEY && API_SECRET);
}

async function erpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!isConfigured()) {
    throw new Error("ERPNext not configured");
  }
  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `token ${API_KEY}:${API_SECRET}`,
    ...(init?.headers || {}),
  };
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ERPNext request failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

// Shifts
export async function fetchShiftTypes(): Promise<ShiftInfo[]> {
  if (!isConfigured()) {
    // Fallback stub data
    return [
      { name: "Morning", start: "06:00", end: "14:00", breakMinutes: 30 },
      { name: "Afternoon", start: "14:00", end: "22:00", breakMinutes: 30 },
      { name: "Night", start: "22:00", end: "06:00", breakMinutes: 30 },
    ];
  }
  // Example: many ERPNext setups use Shift Type doctype
  // Adjust path/fields to your ERPNext schema
  const data = await erpFetch<{ data: Array<{ name: string; start_time?: string; end_time?: string; break_minutes?: number }> }>(
    `/api/resource/Shift Type?fields=["name","start_time","end_time","break_minutes"]`
  );
  return (data.data || []).map((s) => ({
    name: s.name,
    start: (s.start_time || "06:00").slice(0, 5),
    end: (s.end_time || "14:00").slice(0, 5),
    breakMinutes: s.break_minutes ?? 30,
  }));
}

// Items (Articles)
export async function fetchItemDetails(itemName: string): Promise<ItemDetails | null> {
  if (!itemName) return null;
  if (!isConfigured()) {
    // Fallback stub using a local image
    return {
      name: itemName,
      description: "Sample article from ERP (stub)",
      dimensions: "120 x 80 x 60 mm",
      weight: "1.2 kg",
      uom: "Nos",
      imageUrl: "/visitor-insights.png",
    };
  }
  // Example for ERPNext Item doctype
  const data = await erpFetch<{ data: { name: string; description?: string; image?: string; weight_uom?: string; net_weight?: number; width?: number; height?: number; length?: number; stock_uom?: string } }>(
    `/api/resource/Item/${encodeURIComponent(itemName)}?fields=["name","description","image","weight_uom","net_weight","width","height","length","stock_uom"]`
  );
  const it = data.data;
  const dims = [it.length, it.width, it.height].every((v) => typeof v === "number")
    ? `${it.length} x ${it.width} x ${it.height}`
    : undefined;
  const weight = typeof it.net_weight === "number" ? `${it.net_weight} ${it.weight_uom || "kg"}` : undefined;
  return {
    name: it.name,
    description: it.description,
    dimensions: dims,
    weight,
    uom: it.stock_uom,
    imageUrl: it.image || undefined,
  };
}

// Work Orders
export async function cancelWorkOrder(orderName: string): Promise<{ success: boolean; message?: string }> {
  if (!orderName) return { success: false, message: "Missing order name" };
  if (!isConfigured()) {
    // Simulate success in stub
    return { success: true, message: "Stub: cancelled locally" };
  }
  try {
    // ERPNext cancel can be done via method call; adjust to your server rules
    // Here we try to set docstatus or call cancel method
    await erpFetch(`/api/resource/Work Order/${encodeURIComponent(orderName)}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Cancelled" }),
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e?.message || String(e) };
  }
}
