import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { parse } from 'csv-parse/sync';

const DATA_DIR = resolve(process.cwd(), 'server-data');

async function ensureDir(path) {
  try { await mkdir(path, { recursive: true }); } catch {}
}

export async function readJson(rel, fallback) {
  const file = resolve(DATA_DIR, rel);
  try {
    const buf = await readFile(file, 'utf8');
    return JSON.parse(buf);
  } catch {
    await ensureDir(dirname(file));
    await writeFile(file, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

export async function writeJson(rel, value) {
  const file = resolve(DATA_DIR, rel);
  await ensureDir(dirname(file));
  await writeFile(file, JSON.stringify(value, null, 2), 'utf8');
}

export async function readCsv(rel, options = {}) {
  const file = resolve(DATA_DIR, rel);
  try {
    const buf = await readFile(file, 'utf8');
    const records = parse(buf, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      ...options,
    });
    return records;
  } catch {
    return undefined;
  }
}

export async function writeCsv(rel, rows, options = {}) {
  const file = resolve(DATA_DIR, rel);
  await ensureDir(dirname(file));
  if (!Array.isArray(rows) || rows.length === 0) {
    await writeFile(file, '', 'utf8');
    return;
  }
  const headers = options.headers || Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => r[h] ?? '').join(','))].join('\n');
  await writeFile(file, csv + '\n', 'utf8');
}
