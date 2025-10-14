import { Router } from 'express';
import { readJson, writeJson } from '../storage.js';

export const router = Router();

router.get('/connectors', async (_req, res) => {
  const data = await readJson('integrity/connectors.json', { plc: false, erp: false, cmms: false, vision: false, energy: false });
  res.json(data);
});

router.post('/connectors', async (req, res) => {
  await writeJson('integrity/connectors.json', req.body || {});
  res.json({ success: true });
});

router.get('/policy', async (_req, res) => {
  const data = await readJson('integrity/policy.json', { manualCaptureDisabled: false, dualSourceValidation: true });
  res.json(data);
});

router.post('/policy', async (req, res) => {
  await writeJson('integrity/policy.json', req.body || {});
  res.json({ success: true });
});

router.get('/audit', async (_req, res) => {
  const data = await readJson('integrity/audit.json', []);
  res.json(data);
});

router.post('/audit', async (req, res) => {
  const list = await readJson('integrity/audit.json', []);
  list.push(req.body);
  await writeJson('integrity/audit.json', list);
  res.json({ success: true });
});
