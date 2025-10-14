import { Router } from 'express';
import { readJson, readCsv } from '../storage.js';
import { hasInflux, query } from '../influx.js';

export const router = Router();

router.get('/machines', async (_req, res) => {
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -15m)
        |> filter(fn: (r) => r._measurement == "machine_status" and r._field == "on")
        |> last()`);
      const map = new Map();
      for (const r of rows) {
        const id = r.machineId || r.asset || r._measurement;
        map.set(id, { id, name: r.name || id, on: Boolean(r._value), line: r.line || 'Line 1' });
      }
      const list = Array.from(map.values());
      if (list.length) return res.json(list);
    } catch {}
  }
  // Try CSV first
  const csv = await readCsv('realtime/machines.csv');
  if (csv && csv.length) {
    const normalized = csv.map(r => ({
      id: String(r.id),
      name: r.name || String(r.id),
      on: r.on === '1' || r.on === 'true' || r.on === true,
      line: r.line || 'Line 1',
    }));
    return res.json(normalized);
  }
  const data = await readJson('realtime/machines.json', [
    { id: 'M-01', name: 'CNC Mill A', on: true, line: 'Line 1' },
    { id: 'M-02', name: 'Lathe B', on: false, line: 'Line 1' },
    { id: 'M-03', name: 'Robot Arm C', on: true, line: 'Line 2' },
  ]);
  res.json(data);
});

router.get('/counts', async (_req, res) => {
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "counts")
        |> last()`);
      const total = Number(rows.find(r => r._field === 'total')?._value ?? 0);
      const good = Number(rows.find(r => r._field === 'good')?._value ?? 0);
      const scrap = Number(rows.find(r => r._field === 'scrap')?._value ?? 0);
      const ratePerHour = Number(rows.find(r => r._field === 'ratePerHour')?._value ?? 0);
      if (total || good || scrap || ratePerHour) return res.json({ total, good, scrap, ratePerHour });
    } catch {}
  }
  const countsCsv = await readCsv('realtime/counts.csv');
  if (countsCsv && countsCsv.length) {
    const row = countsCsv[0];
    const out = {
      total: Number(row.total ?? 0),
      good: Number(row.good ?? 0),
      scrap: Number(row.scrap ?? 0),
      ratePerHour: Number(row.ratePerHour ?? 0),
    };
    return res.json(out);
  }
  const data = await readJson('realtime/counts.json', { total: 1250, good: 1190, scrap: 60, ratePerHour: 210 });
  res.json(data);
});

router.get('/minute-oee', async (req, res) => {
  const line = String(req.query.line || 'Line 1');
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -60m)
        |> filter(fn: (r) => r._measurement == "minute_oee" and r.line == "${line}")`);
      const byMin = new Map();
      for (const r of rows) {
        const minute = new Date(r._time).toISOString().slice(11, 16);
        const cur = byMin.get(minute) || { minute };
        cur[r._field] = Number(r._value);
        byMin.set(minute, cur);
      }
      const list = Array.from(byMin.values()).sort((a,b) => a.minute.localeCompare(b.minute));
      if (list.length) return res.json(list);
    } catch {}
  }
  const data = await readJson(`realtime/${line}-minute-oee.json`, []);
  if (!data.length) {
    const now = new Date();
    const gen = Array.from({ length: 60 }).map((_, i) => {
      const d = new Date(now.getTime() - (59 - i) * 60000);
      const a = 85 + Math.floor(Math.random() * 5);
      const p = 80 + Math.floor(Math.random() * 8);
      const q = 95 + Math.floor(Math.random() * 3);
      const o = Math.round((a / 100) * (p / 100) * (q / 100) * 100);
      return { minute: d.toISOString().slice(11, 16), availability: a, performance: p, quality: q, oee: o };
    });
    return res.json(gen);
  }
  res.json(data);
});

router.get('/micro-stops', async (req, res) => {
  const line = String(req.query.line || 'Line 1');
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -2h)
        |> filter(fn: (r) => r._measurement == "micro_stop" and r.line == "${line}")`);
      const out = rows.map(r => ({ machineId: r.machineId || r.asset, startedAt: r._time, durationMs: Number(r.durationMs || 0), reason: r.reason }));
      if (out.length) return res.json(out);
    } catch {}
  }
  const msCsv = await readCsv(`realtime/${line}-micro-stops.csv`);
  if (msCsv && msCsv.length) {
    const out = msCsv.map(r => ({
      machineId: r.machineId,
      startedAt: r.startedAt,
      durationMs: Number(r.durationMs ?? 0),
      reason: r.reason,
    }));
    return res.json(out);
  }
  const data = await readJson(`realtime/${line}-micro-stops.json`, [
    { machineId: 'M-01', startedAt: new Date(Date.now() - 120000).toISOString(), durationMs: 4000, reason: 'Sensor block' },
    { machineId: 'M-03', startedAt: new Date(Date.now() - 360000).toISOString(), durationMs: 6000 },
  ]);
  res.json(data);
});

router.get('/heatmap', async (req, res) => {
  const line = String(req.query.line || 'Line 1');
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "oee_heatmap" and r.line == "${line}")`);
      const list = rows.map(r => ({ hour: new Date(r._time).getHours(), asset: r.asset || r.machineId, oee: Number(r._value) }));
      if (list.length) return res.json(list);
    } catch {}
  }
  const hmCsv = await readCsv(`realtime/${line}-heatmap.csv`);
  if (hmCsv && hmCsv.length) {
    const out = hmCsv.map(r => ({
      hour: Number(r.hour ?? 0),
      asset: r.asset,
      oee: Number(r.oee ?? 0),
    }));
    return res.json(out);
  }
  const assets = ['M-01', 'M-02', 'M-03', 'M-04'];
  const data = await readJson(`realtime/${line}-heatmap.json`, Array.from({ length: 24 * assets.length }).map((_, idx) => ({
    hour: Math.floor(idx / assets.length),
    asset: assets[idx % assets.length],
    oee: 70 + Math.floor(Math.random() * 25),
  })));
  res.json(data);
});
