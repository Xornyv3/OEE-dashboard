import { Router } from 'express';
import { readJson, writeJson, readCsv } from '../storage.js';
import { hasInflux, readLatestDoc, writeDoc } from '../influx.js';

export const router = Router();
const FILE = 'reference-study.json';

router.get('/study', async (_req, res) => {
  if (hasInflux) {
    const doc = await readLatestDoc('reference_study');
    if (doc) return res.json(doc);
  }
  // CSV first
  const csv = await readCsv('reference-study.csv');
  if (csv && csv.length) {
    const r = csv[0];
    const parsed = {
      oeeTargetPct: Number(r.oeeTargetPct ?? 0),
      fpyTargetPct: Number(r.fpyTargetPct ?? 0),
      kwhPerGoodTarget: Number(r.kwhPerGoodTarget ?? 0),
      mttrTargetHours: Number(r.mttrTargetHours ?? 0),
      mtbfTargetHours: Number(r.mtbfTargetHours ?? 0),
      co2PerOrderTargetKg: Number(r.co2PerOrderTargetKg ?? 0),
      byProduct: (() => { try { return JSON.parse(r.byProduct || '{}'); } catch { return {}; } })(),
      byShift: (() => { try { return JSON.parse(r.byShift || '{}'); } catch { return {}; } })(),
      updatedAt: r.updatedAt || new Date().toISOString(),
    };
    return res.json(parsed);
  }
  const study = await readJson(FILE, {
    oeeTargetPct: 85,
    fpyTargetPct: 98,
    kwhPerGoodTarget: 0.9,
    mttrTargetHours: 1,
    mtbfTargetHours: 120,
    co2PerOrderTargetKg: 120,
    byProduct: { 'SKU-1001': { oeeTargetPct: 82 } },
    byShift: { 'Shift A': { oeeTargetPct: 79 } },
    updatedAt: new Date().toISOString(),
  });
  res.json(study);
});

router.post('/study', async (req, res) => {
  const payload = req.body || {};
  const merged = { ...payload };
  if (hasInflux) {
    await writeDoc('reference_study', {}, merged);
  } else {
    await writeJson(FILE, merged);
  }
  res.json({ ok: true });
});
