import { Router } from 'express';
import { readJson, writeJson } from '../storage.js';
import { hasInflux, query, writePoint } from '../influx.js';
import { customAlphabet } from 'nanoid/non-secure';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);
export const router = Router();

router.get('/', async (_req, res) => {
  const fallback = [
    { id: 'a1', kind: 'performance-dip', severity: 'warning', line: 'Line 1', happenedAt: new Date().toISOString(), message: 'Performance −12% vs baseline (15min)' },
    { id: 'a2', kind: 'mttr-breach', severity: 'critical', machineId: 'M-02', happenedAt: new Date(Date.now()-20*60*1000).toISOString(), message: 'MTTR > 30m on M-02' },
    { id: 'a3', kind: 'order-at-risk', severity: 'warning', orderId: 'WO-2024-002', happenedAt: new Date().toISOString(), message: 'Order WO-2024-002 at risk due to rate loss' },
  ];
  if (hasInflux) {
    try {
      const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -7d)
        |> filter(fn: (r) => r._measurement == "alerts" and r._field == "message")`);
      const map = new Map();
      for (const r of rows) {
        const id = r.id || r._time;
        const item = map.get(id) || { id, happenedAt: r._time };
        if (r.kind) item.kind = r.kind;
        if (r.severity) item.severity = r.severity;
        if (r.line) item.line = r.line;
        if (r.machineId) item.machineId = r.machineId;
        if (r.orderId) item.orderId = r.orderId;
        if (r._field === 'message') item.message = r._value;
        map.set(id, item);
      }
      const list = Array.from(map.values()).sort((a, b) => new Date(b.happenedAt) - new Date(a.happenedAt));
      if (list.length) return res.json(list);
    } catch {}
  }
  const data = await readJson('alerts/list.json', fallback);
  res.json(data);
});

router.post('/:id/ack', async (req, res) => {
  const list = await readJson('alerts/list.json', []);
  const id = req.params.id;
  const idx = list.findIndex((a) => a.id === id);
  if (idx >= 0) list[idx].acknowledged = true;
  if (hasInflux) await writePoint('alerts_events', { acknowledged: 1 }, { id });
  await writeJson('alerts/list.json', list);
  res.json({ success: true });
});

router.post('/:id/route', async (req, res) => {
  const list = await readJson('alerts/list.json', []);
  const id = req.params.id;
  const { group } = req.body || {};
  const idx = list.findIndex((a) => a.id === id);
  if (idx >= 0) list[idx].routedTo = group || 'maintenance';
  if (hasInflux) await writePoint('alerts_events', { routedTo: group || 'maintenance' }, { id });
  await writeJson('alerts/list.json', list);
  res.json({ success: true });
});

router.post('/:id/escalate', async (req, res) => {
  const list = await readJson('alerts/list.json', []);
  const id = req.params.id;
  const idx = list.findIndex((a) => a.id === id);
  if (idx >= 0) list[idx].escalated = true;
  if (hasInflux) await writePoint('alerts_events', { escalated: 1 }, { id });
  await writeJson('alerts/list.json', list);
  res.json({ success: true });
});
