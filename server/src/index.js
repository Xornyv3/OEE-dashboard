import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router as realtimeRouter } from './routes/realtime.js';
import { router as alertsRouter } from './routes/alerts.js';
import { router as planningRouter } from './routes/planning.js';
import { router as integrityRouter } from './routes/integrity.js';
import { router as maintenanceRouter } from './routes/maintenance.js';
import { router as qualityRouter } from './routes/quality.js';
import { router as analyticsRouter } from './routes/analytics.js';
import { router as energyRouter } from './routes/energy.js';
import { router as referenceRouter } from './routes/reference.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/realtime', realtimeRouter);
app.use('/alerts', alertsRouter);
app.use('/planning', planningRouter);
app.use('/integrity', integrityRouter);
app.use('/maintenance', maintenanceRouter);
app.use('/quality', qualityRouter);
app.use('/analytics', analyticsRouter);
app.use('/energy', energyRouter);
app.use('/reference', referenceRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Prodex backend listening on http://localhost:${port}`);
});
