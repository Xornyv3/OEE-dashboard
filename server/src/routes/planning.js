import { Router } from 'express';
import { readJson, writeJson } from '../storage.js';
import { hasInflux, query, writeDoc } from '../influx.js';

export const router = Router();

router.get('/articles', async (_req, res) => {
  const data = await readJson('planning/articles.json', [
    { name: 'SKU-1001', desc: 'Gear Housing' },
    { name: 'SKU-2002', desc: 'Valve Body' },
  ]);
  res.json(data);
});

router.get('/machines', async (_req, res) => {
  const data = await readJson('planning/machines.json', [
    { id: 'M-01', name: 'CNC Mill A' },
    { id: 'M-02', name: 'Lathe B' },
  ]);
  res.json(data);
});

router.get('/shifts', async (_req, res) => {
  const data = await readJson('planning/shifts.json', [
    { id: 'S1', name: 'Shift A', start: '06:00', end: '14:00' },
    { id: 'S2', name: 'Shift B', start: '14:00', end: '22:00' },
  ]);
  res.json(data);
});

router.get('/assignments', async (_req, res) => {
  if (hasInflux) {
    try {
      const doc = await (async () => {
        const rows = await query(`from(bucket: "${process.env.INFLUX_BUCKET}")
          |> range(start: -14d)
          |> filter(fn: (r) => r._measurement == "planning_assignments" and r._field == "doc")
          |> last()`);
        if (rows && rows.length) {
          try { return JSON.parse(rows[0]._value); } catch {}
        }
        return undefined;
      })();
      if (doc && Array.isArray(doc)) return res.json(doc);
    } catch {}
  }
  const data = await readJson('planning/assignments.json', []);
  res.json(data);
});

router.post('/assignments', async (req, res) => {
  const list = await readJson('planning/assignments.json', []);
  list.push(req.body);
  if (hasInflux) {
    await writeDoc('planning_assignments', {}, list);
  }
  await writeJson('planning/assignments.json', list);
  res.json({ success: true });
});

router.delete('/assignments', async (req, res) => {
  const list = await readJson('planning/assignments.json', []);
  const { machineId, shiftId } = req.query;
  const filtered = list.filter((a) => !(a.machineId === machineId && a.shiftId === shiftId));
  if (hasInflux) {
    await writeDoc('planning_assignments', {}, filtered);
  }
  await writeJson('planning/assignments.json', filtered);
  res.json({ success: true });
});
