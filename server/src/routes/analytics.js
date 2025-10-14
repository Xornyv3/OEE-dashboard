import { Router } from 'express';
import { hasInflux, query, writePoint } from '../influx.js';

export const router = Router();

router.get('/root-causes', async (req, res) => {
  res.json([
    { loss: 'Changeover duration', estimatedPoints: 2.3, contributions: [
      { factor: 'Product mix volatility', impactPoints: 1.2, shap: 0.4 },
      { factor: 'Crew experience', impactPoints: 0.8, shap: 0.35 },
    ]},
    { loss: 'Minor stops', estimatedPoints: 1.6, contributions: [
      { factor: 'Sensor false triggers', impactPoints: 0.9, shap: 0.3 },
      { factor: 'Material variability', impactPoints: 0.5, shap: 0.2 },
    ]},
  ]);
});

router.get('/plays', async (_req, res) => {
  res.json([
    { id: 'play1', action: 'Reduce changeover by 6 min', expectedDeltaOee: 3.1, confidence: 0.72 },
    { id: 'play2', action: 'Increase sensor debounce by 30ms', expectedDeltaOee: 0.8, confidence: 0.64 },
  ]);
});

router.post('/what-if', async (req, res) => {
  const input = req.body || {};
  const base = 78 + Math.random() * 6;
  const delta = (input.speedPct - 100) * 0.05 + (input.crew - 3) * 0.4 + (input.maintenanceAt ? 0.6 : 0);
  const predicted = Math.max(60, Math.min(95, base + delta));
  const result = {
    predictedOee: Number(predicted.toFixed(1)),
    details: [
      { factor: 'Speed change', deltaPoints: Number(((input.speedPct - 100) * 0.05).toFixed(2)) },
      { factor: 'Crew level', deltaPoints: Number(((input.crew - 3) * 0.4).toFixed(2)) },
      { factor: 'Maintenance timing', deltaPoints: input.maintenanceAt ? 0.6 : 0 },
    ],
  };
  if (hasInflux) {
    try {
      await writePoint('what_if', { predictedOee: result.predictedOee, speedPct: input.speedPct, crew: input.crew }, { maintenanceAt: input.maintenanceAt ? 'true' : 'false' });
    } catch {}
  }
  res.json(result);
});

router.get('/targets', async (_req, res) => {
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "dynamic_target")`);
      const map = new Map();
      for (const r of rows) {
        const scope = r.scope || 'product';
        const key = r.key || r._measurement;
        const id = `${scope}::${key}`;
        const item = map.get(id) || { scope, key, oeeTarget: undefined, lastUpdated: r._time };
        if (r._field === 'oeeTarget') item.oeeTarget = Number(r._value);
        if (!item.lastUpdated || new Date(r._time) > new Date(item.lastUpdated)) item.lastUpdated = r._time;
        map.set(id, item);
      }
      const list = Array.from(map.values()).filter(x => typeof x.oeeTarget === 'number');
      if (list.length) return res.json(list);
    } catch {}
  }
  res.json([
    { scope: 'product', key: 'SKU-1001', oeeTarget: 82.5, lastUpdated: new Date().toISOString() },
    { scope: 'shift', key: 'Shift A', oeeTarget: 79.0, lastUpdated: new Date().toISOString() },
    { scope: 'environment', key: 'High humidity', oeeTarget: 77.5, lastUpdated: new Date().toISOString() },
  ]);
});

router.post('/targets', async (req, res) => {
  const arr = Array.isArray(req.body) ? req.body : [req.body];
  let ok = true;
  if (hasInflux) {
    for (const t of arr) {
      try {
        await writePoint('dynamic_target', { oeeTarget: Number(t.oeeTarget) }, { scope: t.scope, key: t.key });
      } catch { ok = false; }
    }
  }
  res.json({ ok });
});
