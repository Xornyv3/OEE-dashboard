import { createApp } from '../server/src/app.js';

export default function handler(req, res) {
  const app = createApp();
  // Strip the /api prefix so Express routes like /realtime/... match
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  return app(req, res);
}
