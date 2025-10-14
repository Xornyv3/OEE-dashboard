import { InfluxDB, Point } from '@influxdata/influxdb-client';

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

export const hasInflux = Boolean(url && token && org && bucket);

let client;
function getClient() {
  if (!hasInflux) return undefined;
  if (!client) client = new InfluxDB({ url, token });
  return client;
}

export function getQueryApi() {
  const c = getClient();
  if (!c) return undefined;
  return c.getQueryApi(org);
}

export function getWriteApi(precision = 's') {
  const c = getClient();
  if (!c) return undefined;
  return c.getWriteApi(org, bucket, precision);
}

export async function writeDoc(measurement, tags = {}, doc = {}) {
  if (!hasInflux) return false;
  const writeApi = getWriteApi();
  const p = new Point(measurement).stringField('doc', JSON.stringify(doc));
  for (const [k, v] of Object.entries(tags)) {
    if (v !== undefined && v !== null) p.tag(k, String(v));
  }
  writeApi.writePoint(p);
  await writeApi.flush();
  return true;
}

export async function readLatestDoc(measurement, tags = {}, range = '-30d') {
  if (!hasInflux) return undefined;
  const queryApi = getQueryApi();
  const tagFilters = Object.entries(tags)
    .map(([k, v]) => `|> filter(fn: (r) => r["${k}"] == "${v}")`)
    .join('\n');
  const flux = `from(bucket: "${bucket}")
  |> range(start: ${range})
  |> filter(fn: (r) => r._measurement == "${measurement}")
  ${tagFilters}
  |> filter(fn: (r) => r._field == "doc")
  |> last()`;
  const rows = await queryApi.collectRows(flux);
  if (!rows || !rows.length) return undefined;
  const val = rows[0]._value;
  try { return JSON.parse(val); } catch { return undefined; }
}

export async function writePoint(measurement, fields = {}, tags = {}, timestamp) {
  if (!hasInflux) return false;
  const writeApi = getWriteApi();
  const p = new Point(measurement);
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === 'number') p.floatField(k, v);
    else if (typeof v === 'boolean') p.booleanField(k, v);
    else if (v != null) p.stringField(k, String(v));
  }
  for (const [k, v] of Object.entries(tags)) {
    if (v !== undefined && v !== null) p.tag(k, String(v));
  }
  if (timestamp) p.timestamp(new Date(timestamp));
  writeApi.writePoint(p);
  await writeApi.flush();
  return true;
}

export async function query(flux) {
  if (!hasInflux) return [];
  const queryApi = getQueryApi();
  return queryApi.collectRows(flux);
}
