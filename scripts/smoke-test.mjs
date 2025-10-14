/*
 Simple smoke tests for Blue Upgrade Technology dev environment.
 Requires the dev servers to be running:
  - Backend: http://localhost:4000
  - Frontend (Vite): http://localhost:5173
 Uses Node's global fetch (Node 18+)
*/

// Ensure localhost bypasses any system/corporate proxies for Node's HTTP client
if (!process.env.NO_PROXY) {
  process.env.NO_PROXY = 'localhost,127.0.0.1';
}
// Try to bypass proxies by setting a direct Agent via undici if available
try {
  const undici = await import('undici');
  if (undici?.setGlobalDispatcher && undici?.Agent) {
    undici.setGlobalDispatcher(new undici.Agent({
      pipelining: 0,
      keepAliveTimeout: 10,
      keepAliveMaxTimeout: 10,
    }));
  }
} catch (_) {
  // undici not available as import; continue with defaults
}

const BASE_BACKEND = process.env.BASE_BACKEND || 'http://127.0.0.1:4000';
const BASE_FRONTEND = process.env.BASE_FRONTEND || 'http://127.0.0.1:5173';

const timeout = (ms) => new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), ms));

import http from 'node:http';
import https from 'node:https';
import { URL as NodeURL } from 'node:url';

function httpRequestRaw(urlStr, ms = 5000) {
  return new Promise((resolve, reject) => {
    const u = new NodeURL(urlStr);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + (u.search || ''),
      method: 'GET',
      headers: { 'accept': '*/*' },
      timeout: ms,
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode || 0, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { try { req.destroy(new Error('Timeout')); } catch {} });
    req.end();
  });
}
      //  Simple smoke tests for Blue Upgrade Technology dev environment.
async function getJson(url, ms = 5000, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await Promise.race([
        fetch(url, { headers: { 'accept': 'application/json' } }),
        timeout(ms),
      ]);
      if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      // Fallback to raw http if fetch fails
      try {
        const r = await httpRequestRaw(url, ms);
        if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`${url} -> HTTP ${r.statusCode}`);
        return JSON.parse(r.body);
      } catch (_) {}
      await new Promise(r => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastErr || new Error('Unknown error');
}

async function getText(url, ms = 5000, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await Promise.race([
        fetch(url),
        timeout(ms),
      ]);
      if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
      return { text: await res.text(), headers: res.headers };
    } catch (e) {
      lastErr = e;
      // Fallback to raw http if fetch fails
      try {
        const r = await httpRequestRaw(url, ms);
        if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`${url} -> HTTP ${r.statusCode}`);
        return { text: r.body, headers: new Map(Object.entries(r.headers || {})) };
      } catch (_) {}
      await new Promise(r => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastErr || new Error('Unknown error');
}

function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

async function run() {
  const results = [];
  let failed = 0;

  async function test(name, fn) {
    const start = Date.now();
    try {
      await fn();
      const ms = Date.now() - start;
      console.log(`PASS ${name} (${ms}ms)`);
      results.push({ name, ok: true, ms });
    } catch (e) {
      const ms = Date.now() - start;
      console.error(`FAIL ${name}: ${e?.message || e}`);
      if (e?.stack) console.error(e.stack);
      results.push({ name, ok: false, ms, error: String(e?.message || e) });
      failed++;
    }
  }

  await test('Backend health', async () => {
    const data = await getJson(`${BASE_BACKEND}/health`);
    assert(data && data.ok === true, 'health.ok should be true');
    assert(typeof data.time === 'string', 'health.time should be string');
  });

  await test('Realtime machines', async () => {
    const list = await getJson(`${BASE_BACKEND}/realtime/machines`);
    assert(Array.isArray(list), 'machines should be array');
    assert(list.length >= 1, 'machines list should not be empty');
    const m = list[0];
    assert(m && 'id' in m, 'machine has id');
  });

  await test('Realtime counts', async () => {
    const data = await getJson(`${BASE_BACKEND}/realtime/counts`);
    assert(typeof data.total === 'number', 'counts.total number');
    assert(typeof data.good === 'number', 'counts.good number');
    assert(typeof data.scrap === 'number', 'counts.scrap number');
  });

  await test('Reference study', async () => {
    const data = await getJson(`${BASE_BACKEND}/reference/study`);
    assert(typeof data === 'object' && data !== null, 'study is object');
    assert('oeeTargetPct' in data || 'updatedAt' in data, 'study has expected fields');
  });

  await test('Frontend root', async () => {
    const { text, headers } = await getText(`${BASE_FRONTEND}/`);
    const ct = headers.get('content-type') || '';
    assert(ct.includes('text/html') || text.includes('<!DOCTYPE html>'), 'frontend served HTML');
  });

  console.log(`\nSummary: ${results.filter(r => r.ok).length} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

run().catch((e) => { console.error('Unexpected error:', e); process.exit(2); });
