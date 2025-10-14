import { Router } from 'express';
import { hasInflux, query } from '../influx.js';

export const router = Router();

router.get('/fpy', async (req, res) => {
  const k = String(req.query.k || 'shift');
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "quality_kpis" and r.horizon == "${k}")
        |> last()`);
      const fpyPct = Number(rows.find(r => r._field === 'fpyPct')?._value ?? 0);
      const scrapPct = Number(rows.find(r => r._field === 'scrapPct')?._value ?? 0);
      const reworkPct = Number(rows.find(r => r._field === 'reworkPct')?._value ?? 0);
      if (fpyPct || scrapPct || reworkPct) return res.json({ fpyPct, scrapPct, reworkPct, horizon: k });
    } catch {}
  }
  res.json({ fpyPct: 96.8, scrapPct: 2.1, reworkPct: 1.1, horizon: k });
});

router.get('/scrap', async (req, res) => {
  const h = String(req.query.h || 'shift');
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "scrap_breakdown" and r.horizon == "${h}")`);
      const list = rows.map(r => ({ reason: r.reason || r._field, count: Number(r.count || r._value || 0), cavity: r.cavity, operator: r.operator, lot: r.lot }));
      if (list.length) return res.json(list);
    } catch {}
  }
  res.json([
    { reason: 'Short shot', count: 18, cavity: 'C2' },
    { reason: 'Flash', count: 12, cavity: 'C4', operator: 'OP-12' },
    { reason: 'Warp', count: 8, lot: 'LOT-8841' },
  ]);
});

router.get('/spc', async (req, res) => {
  const now = Date.now();
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -50m)
        |> filter(fn: (r) => r._measurement == "spc" and r._field == "value")`);
      const series = rows.map(r => ({ t: r._time, value: Number(r._value) }));
      if (series.length) return res.json(series);
    } catch {}
  }
  const cl = 10.0, ucl = 10.5, lcl = 9.5;
  const series = Array.from({ length: 50 }).map((_, i) => ({
    t: new Date(now - (49 - i) * 60000).toISOString(),
    value: cl + (Math.random() - 0.5) * 0.6,
    ucl, lcl, cl,
  }));
  res.json(series);
});

router.get('/vision-heatmap', async (_req, res) => {
  const cells = Array.from({ length: 200 }).map(() => ({
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 10),
    density: Math.random(),
  }));
  res.json(cells);
});

router.get('/trace/material/:lotId', async (req, res) => {
  const lotId = req.params.lotId;
  const now = Date.now();
  res.json([
    { type: 'material', id: lotId, label: lotId },
    { type: 'machine', id: 'M-02', label: 'Lathe B', at: new Date(now - 3600e3).toISOString() },
    { type: 'order', id: 'WO-2024-003', label: 'WO-2024-003' },
    { type: 'customer', id: 'CUST-145', label: 'ACME Aerospace' },
  ]);
});
