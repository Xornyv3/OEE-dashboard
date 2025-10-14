import { createApp } from '../server/src/app.js';

export default function handler(req, res) {
  const app = createApp();
  // Ensure Express sees the path without the /api prefix
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  return app(req, res);
}
