// Energy & Sustainability: kWh/Good, peak demand alarms, energy cost of losses, OPE/OEEe, CO2 intensity

export type EnergyKpi = {
  kwhPerGood: number; // kWh per good part
  kwhPerTotal: number; // kWh per total part
  period: 'shift' | 'day' | 'week';
};

export type PeakDemandAlarm = { id: string; occurredAt: string; kw: number; thresholdKw: number; message: string; acknowledged?: boolean };

export type LossEnergyCost = { lossType: string; kwh: number; cost: number };

export type Opee = { equipmentEffectiveness: number; energyEffectiveness: number; oeee: number };

export type OrderFootprint = { orderId: string; co2Kg: number; kwh: number };

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

export async function getEnergyKpis(period: 'shift' | 'day' | 'week' = 'shift'): Promise<EnergyKpi> {
  const fallback: EnergyKpi = { kwhPerGood: 0.92, kwhPerTotal: 1.05, period };
  return safeGet(`/energy/kpis?period=${period}`, fallback);
}

export async function listPeakDemandAlarms(): Promise<PeakDemandAlarm[]> {
  const now = Date.now();
  const fallback: PeakDemandAlarm[] = [
    { id: 'pd1', occurredAt: new Date(now - 1800e3).toISOString(), kw: 485, thresholdKw: 450, message: 'Peak demand exceeded in last window', acknowledged: false },
  ];
  return safeGet('/energy/peak-alarms', fallback);
}

export async function getEnergyCostOfLosses(): Promise<LossEnergyCost[]> {
  const fallback: LossEnergyCost[] = [
    { lossType: 'Idle/Standby', kwh: 120, cost: 18.6 },
    { lossType: 'Changeover', kwh: 75, cost: 11.2 },
    { lossType: 'Scrap/Rework', kwh: 54, cost: 8.1 },
  ];
  return safeGet('/energy/loss-cost', fallback);
}

export async function getOpee(): Promise<Opee> {
  const equipmentEffectiveness = 0.79;
  const energyEffectiveness = 0.86;
  const oeee = Number((equipmentEffectiveness * energyEffectiveness).toFixed(2));
  const fallback: Opee = { equipmentEffectiveness, energyEffectiveness, oeee };
  return safeGet('/energy/oeee', fallback);
}

export async function getCo2PerOrder(orderId: string): Promise<OrderFootprint> {
  const fallback: OrderFootprint = { orderId, co2Kg: 128.4, kwh: 942 };
  return safeGet(`/energy/co2/${encodeURIComponent(orderId)}`, fallback);
}
