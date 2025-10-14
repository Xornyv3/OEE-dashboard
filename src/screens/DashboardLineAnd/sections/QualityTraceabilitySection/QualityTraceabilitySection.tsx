import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { getFpyKpis, listScrapReasons, getSpcSeries, getVisionHeatmap, tracePathFromMaterial, type FpyKpis, type ScrapReason, type SpcSample, type VisionHeatCell, type TraceHop } from "../../../../lib/quality";
import { SearchIcon } from "lucide-react";

export const QualityTraceabilitySection = (): JSX.Element => {
  const [fpy, setFpy] = useState<FpyKpis | null>(null);
  const [scrap, setScrap] = useState<ScrapReason[]>([]);
  const [spc, setSpc] = useState<SpcSample[]>([]);
  const [vision, setVision] = useState<VisionHeatCell[]>([]);
  const [trace, setTrace] = useState<TraceHop[]>([]);
  const [lot, setLot] = useState<string>('LOT-1234');

  useEffect(() => {
    (async () => {
      const [f, s, ss, vh] = await Promise.all([
        getFpyKpis('shift'),
        listScrapReasons('shift'),
        getSpcSeries('length'),
        getVisionHeatmap(),
      ]);
      setFpy(f); setScrap(s); setSpc(ss); setVision(vh);
      const t = await tracePathFromMaterial(lot);
      setTrace(t);
    })();
  }, [lot]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">FPY / Scrap / Rework</CardTitle></CardHeader>
          <CardContent>
            {fpy && (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-tint-good/50 rounded px-2 py-1">
                  <span className="text-white/60 text-sm">FPY</span>
                  <span className="text-status-good font-semibold">{fpy.fpyPct}%</span>
                </div>
                <div className="flex items-center justify-between bg-tint-bad/40 rounded px-2 py-1">
                  <span className="text-white/60 text-sm">Scrap</span>
                  <span className="text-status-bad font-semibold">{fpy.scrapPct}%</span>
                </div>
                <div className="flex items-center justify-between bg-tint-warn/40 rounded px-2 py-1">
                  <span className="text-white/60 text-sm">Rework</span>
                  <span className="text-status-warn font-semibold">{fpy.reworkPct}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">Top Scrap Reasons</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Reason</TableHead><TableHead className="text-white/70">Count</TableHead><TableHead className="text-white/70">Context</TableHead></TableRow></TableHeader>
              <TableBody>
                {scrap.map((r, idx) => {
                  const severityClass = r.count > 15 ? 'text-status-bad' : r.count > 10 ? 'text-status-warn' : 'text-status-good';
                  return (
                    <TableRow key={idx} className="border-white/10">
                      <TableCell className="text-white/80">{r.reason}</TableCell>
                      <TableCell className={`font-semibold ${severityClass}`}>{r.count}</TableCell>
                      <TableCell className="text-white/70 text-xs">{[r.lot && `Lot ${r.lot}`, r.tool && `Tool ${r.tool}`, r.cavity && `Cavity ${r.cavity}`, r.operator && `Op ${r.operator}`].filter(Boolean).join(' • ')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">SPC (length)</CardTitle></CardHeader>
          <CardContent>
            <svg className="w-full h-36" viewBox="0 0 220 100" preserveAspectRatio="none" aria-label="SPC chart">
              {/* UCL/LCL/CL */}
              {spc.length > 0 && (
                <>
                  <line x1={0} x2={220} y1={20} y2={20} stroke="#F87171" strokeDasharray="4,4" />
                  <line x1={0} x2={220} y1={80} y2={80} stroke="#F87171" strokeDasharray="4,4" />
                  <line x1={0} x2={220} y1={50} y2={50} stroke="#93C5FD" strokeDasharray="2,4" />
                </>
              )}
              <polyline fill="none" stroke="#FFFFFF" strokeWidth="1.5" points={spc.map((p, i) => `${(i/(spc.length-1))*220},${50 + (p.cl - p.value)*40}`).join(' ')} />
            </svg>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">Vision: Defect Heatmap</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-20 gap-0.5 max-h-64 overflow-y-auto pr-1">
              {vision.map((c, idx) => {
                const d = Math.max(0, Math.min(1, c.density));
                const band = d > 0.8 ? 'bg-red-600' : d > 0.6 ? 'bg-red-500' : d > 0.4 ? 'bg-orange-500' : d > 0.2 ? 'bg-yellow-500' : 'bg-emerald-500';
                return <div key={idx} className={`w-3 h-3 ${band}`} title={`(${c.x},${c.y}) ${Math.round(d*100)}%`} />;
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><SearchIcon className="w-5 h-5"/> e-Traceability</CardTitle></CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <input aria-label="Lot" className="bg-white/5 border border-white/10 rounded-[6px] px-2 py-1 text-white/90" value={lot} onChange={(e)=>setLot(e.currentTarget.value)} />
            </div>
            <div className="flex items-center gap-2 flex-wrap text-white/80 text-sm">
              {trace.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="rounded-[6px] border border-white/15 bg-white/5 px-2 py-1">{h.type}:{h.label}</div>
                  {idx < trace.length-1 && <span className="text-white/40">→</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
