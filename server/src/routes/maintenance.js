import { Router } from 'express';
import { readJson } from '../storage.js';
import { hasInflux, query } from '../influx.js';

export const router = Router();

router.get('/conditions', async (req, res) => {
  const assets = String(req.query.assets || '').split(',').filter(Boolean);
  if (hasInflux && assets.length) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -60m)
        |> filter(fn: (r) => r._measurement == "condition" and contains(value: r.assetId, set: ${JSON.stringify(assets)}))`);
      const map = new Map();
      for (const r of rows) {
        const assetId = r.assetId || r.machineId;
        const cur = map.get(assetId) || { assetId, samples: [] };
        const sample = cur.samples.find(s => s.t === r._time) || { t: r._time };
        sample[`${r._field}`] = r._value;
        if (!cur.samples.includes(sample)) cur.samples.push(sample);
        map.set(assetId, cur);
      }
      const out = Array.from(map.values());
      if (out.length) return res.json(out);
    } catch {}
  }
  const now = Date.now();
  const data = await readJson('maintenance/conditions.json', assets.map((assetId) => ({
    assetId,
    samples: Array.from({ length: 60 }).map((_, i) => ({
      t: new Date(now - (59 - i) * 60000).toISOString(),
      vibration_g: 0.9 + Math.random() * 0.4,
      temperature_c: 52 + Math.random() * 6,
      amperage_a: 7 + Math.random() * 2,
    })),
  })));
  res.json(data);
});

router.get('/rul', async (req, res) => {
  const assets = String(req.query.assets || '').split(',').filter(Boolean);
  const data = assets.map((id) => {
    const predictedHours = Math.floor(80 + Math.random() * 200);
    const confidence = 0.7 + Math.random() * 0.25;
    const status = predictedHours < 100 ? (predictedHours < 60 ? 'critical' : 'warning') : 'normal';
    return { assetId: id, predictedHours, confidence: Number(confidence.toFixed(2)), status };
  });
  res.json(data);
});

router.get('/failure-modes', async (_req, res) => {
  const data = await readJson('maintenance/failure-modes.json', [
    { id: 'fm1', name: 'Bearing wear', signals: ['vibration', 'temperature'], probableCauses: ['Insufficient lubrication', 'Contamination'], standardFixes: ['Lubricate bearings', 'Replace bearing', 'Check seals and clean'] },
    { id: 'fm2', name: 'Motor overload', signals: ['amperage', 'temperature'], probableCauses: ['Over-tensioned belts', 'Jammed mechanism'], standardFixes: ['Adjust belt tension', 'Inspect gearbox & remove debris'] },
  ]);
  res.json(data);
});

router.get('/timeline/:assetId', async (req, res) => {
  const assetId = req.params.assetId;
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -90d)
        |> filter(fn: (r) => r._measurement == "maintenance_timeline" and r.assetId == "${assetId}")`);
      const list = rows.map(r => ({ assetId, kind: r.kind || r._field, at: r._time, notes: r.notes }));
      if (list.length) return res.json(list);
    } catch {}
  }
  const now = Date.now();
  const data = await readJson(`maintenance/${assetId}-timeline.json`, [
    { assetId, kind: 'inspection', at: new Date(now - 7 * 24 * 3600e3).toISOString(), notes: 'Weekly check OK' },
    { assetId, kind: 'service', at: new Date(now - 30 * 24 * 3600e3).toISOString(), notes: 'Replaced filter and oil' },
    { assetId, kind: 'failure', at: new Date(now - 45 * 24 * 3600e3).toISOString(), notes: 'Minor jam cleared' },
  ]);
  res.json(data);
});

router.get('/reliability/:assetId', async (req, res) => {
  const labels = Array.from({ length: 12 }).map((_, i) => `W${i + 1}`);
  const mtbfHours = labels.map(() => 120 + Math.floor(Math.random() * 40));
  const mttrHours = labels.map(() => Number((2 + Math.random() * 1.5).toFixed(2)));
  res.json({ labels, mtbfHours, mttrHours });
});

router.get('/impact/:assetId', async (req, res) => {
  res.json({ assetId: req.params.assetId, availabilityDelta: -1.2, performanceDelta: -0.8, qualityDelta: -0.3 });
});
