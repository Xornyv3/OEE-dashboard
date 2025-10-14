// @ts-nocheck
// This file is unused; JS version exists at realtime.js
export {};

import { Router, Request, Response } from 'express';
import { readJson } from '../storage.js';

export const router = Router();

router.get('/machines', async (_req: Request, res: Response) => {
  const data = await readJson('realtime/machines.json', [
    { id: 'M-01', name: 'CNC Mill A', on: true, line: 'Line 1' },
    { id: 'M-02', name: 'Lathe B', on: false, line: 'Line 1' },
    { id: 'M-03', name: 'Robot Arm C', on: true, line: 'Line 2' },
  ]);
  res.json(data);
});

router.get('/counts', async (_req: Request, res: Response) => {
  const data = await readJson('realtime/counts.json', { total: 1250, good: 1190, scrap: 60, ratePerHour: 210 });
  res.json(data);
});

router.get('/minute-oee', async (req: Request, res: Response) => {
  const line = String(req.query.line || 'Line 1');
  const data = await readJson(`realtime/${line}-minute-oee.json`, [] as any[]);
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

router.get('/micro-stops', async (req: Request, res: Response) => {
  const line = String(req.query.line || 'Line 1');
  const data = await readJson(`realtime/${line}-micro-stops.json`, [
    { machineId: 'M-01', startedAt: new Date(Date.now() - 120000).toISOString(), durationMs: 4000, reason: 'Sensor block' },
    { machineId: 'M-03', startedAt: new Date(Date.now() - 360000).toISOString(), durationMs: 6000 },
  ]);
  res.json(data);
});

router.get('/heatmap', async (req: Request, res: Response) => {
  const line = String(req.query.line || 'Line 1');
  const assets = ['M-01', 'M-02', 'M-03', 'M-04'];
  const data = await readJson(`realtime/${line}-heatmap.json`, Array.from({ length: 24 * assets.length }).map((_, idx) => ({
    hour: Math.floor(idx / assets.length),
    asset: assets[idx % assets.length],
    oee: 70 + Math.floor(Math.random() * 25),
  })));
  res.json(data);
});
