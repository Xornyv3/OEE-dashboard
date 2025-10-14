import { Router } from 'express';
import { hasInflux, query } from '../influx.js';

export const router = Router();

router.get('/kpis', async (req, res) => {
  const period = (req.query.period || 'shift').toString();
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "energy_kpis" and r.period == "${period}")
        |> last()`);
      const kwhPerGood = Number((rows.find(r => r._field === 'kwhPerGood')?._value ?? 0.92).toFixed(2));
      const kwhPerTotal = Number((rows.find(r => r._field === 'kwhPerTotal')?._value ?? (kwhPerGood + 0.12)).toFixed(2));
      return res.json({ kwhPerGood, kwhPerTotal, period });
    } catch {}
  }
  const base = period === 'day' ? 1.0 : period === 'week' ? 0.95 : 0.92;
  res.json({ kwhPerGood: Number(base.toFixed(2)), kwhPerTotal: Number((base + 0.12).toFixed(2)), period });
});

router.get('/peak-alarms', async (_req, res) => {
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -48h)
        |> filter(fn: (r) => r._measurement == "energy_peak" and r._field == "kw")`);
      const grouped = new Map();
      for (const r of rows) {
        const id = r.id || `${r._time}`;
        const alarm = grouped.get(id) || { id, occurredAt: r._time, kw: r._value, thresholdKw: r.thresholdKw || 450, message: 'Peak event', acknowledged: r.acknowledged === true };
        grouped.set(id, alarm);
      }
      const list = Array.from(grouped.values()).sort((a,b) => new Date(b.occurredAt) - new Date(a.occurredAt));
      if (list.length) return res.json(list);
    } catch {}
  }
  const now = Date.now();
  res.json([
    { id: 'pk1', occurredAt: new Date(now - 1000 * 60 * 15).toISOString(), kw: 485, thresholdKw: 450, message: 'Approaching contracted peak', acknowledged: false },
    { id: 'pk2', occurredAt: new Date(now - 1000 * 60 * 120).toISOString(), kw: 512, thresholdKw: 450, message: 'Peak demand exceeded', acknowledged: true },
  ]);
});

router.get('/loss-cost', async (_req, res) => {
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -7d)
        |> filter(fn: (r) => r._measurement == "energy_loss_cost")`);
      const out = rows.map(r => ({ lossType: r.lossType || r._measurement, kwh: Number(r.kwh || 0), cost: Number(r.cost || 0) }));
      if (out.length) return res.json(out);
    } catch {}
  }
  res.json([
    { lossType: 'Idle/Standby', kwh: 120, cost: 24.0 },
    { lossType: 'Minor stops', kwh: 75, cost: 15.0 },
    { lossType: 'Scrap/Rework', kwh: 54, cost: 10.8 },
  ]);
});

router.get('/oeee', async (_req, res) => {
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "oeee")
        |> last()`);
      const equipmentEffectiveness = Number(rows.find(r => r._field === 'equipmentEffectiveness')?._value ?? 0.79);
      const energyEffectiveness = Number(rows.find(r => r._field === 'energyEffectiveness')?._value ?? 0.86);
      const oeee = Number((equipmentEffectiveness * energyEffectiveness).toFixed(2));
      return res.json({ equipmentEffectiveness, energyEffectiveness, oeee });
    } catch {}
  }
  const equipmentEffectiveness = 0.79;
  const energyEffectiveness = 0.86;
  const oeee = Number((equipmentEffectiveness * energyEffectiveness).toFixed(2));
  res.json({ equipmentEffectiveness, energyEffectiveness, oeee });
});

router.get('/co2/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "order_footprint" and r.orderId == "${orderId}")
        |> last()`);
      const co2Kg = Number(rows.find(r => r._field === 'co2Kg')?._value ?? 0);
      const kwh = Number(rows.find(r => r._field === 'kwh')?._value ?? 0);
      if (co2Kg || kwh) return res.json({ orderId, co2Kg, kwh });
    } catch {}
  }
  const goodQty = 400 + Math.round(Math.random() * 80);
  const kwh = 800 + Math.round(Math.random() * 300);
  const co2Kg = Number((kwh * 0.136).toFixed(1));
  res.json({ orderId, co2Kg, kwh });
});
