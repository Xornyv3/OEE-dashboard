// @ts-nocheck
// This file is unused; JS version exists at storage.js
export {};

const DATA_DIR = resolve(process.cwd(), 'data');

async function ensureDir(path: string) {
  try { await mkdir(path, { recursive: true }); } catch {}
}

export async function readJson<T>(rel: string, fallback: T): Promise<T> {
  const file = resolve(DATA_DIR, rel);
  try {
    const buf = await readFile(file, 'utf8');
    return JSON.parse(buf) as T;
  } catch {
    await ensureDir(dirname(file));
    await writeFile(file, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

export async function writeJson<T>(rel: string, value: T): Promise<void> {
  const file = resolve(DATA_DIR, rel);
  await ensureDir(dirname(file));
  await writeFile(file, JSON.stringify(value, null, 2), 'utf8');
}
