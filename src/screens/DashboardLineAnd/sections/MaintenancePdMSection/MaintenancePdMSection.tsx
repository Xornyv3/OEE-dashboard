import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { getConditionSeries, getRemainingUsefulLife, listFailureModes, getMaintenanceTimeline, getReliabilityTrends, getMaintenanceImpact, type AssetConditionSeries, type RemainingUsefulLife, type FailureMode, type MaintenanceEvent, type ReliabilityTrends, type OeeImpact } from "../../../../lib/maintenance";
import { ActivityIcon, AlertTriangleIcon, ClockIcon, WrenchIcon } from "lucide-react";

export const MaintenancePdMSection = (): JSX.Element => {
  const [assets] = useState<string[]>(["M-01", "M-02", "M-03"]);
  const [series, setSeries] = useState<AssetConditionSeries[]>([]);
  const [rul, setRul] = useState<RemainingUsefulLife[]>([]);
  const [modes, setModes] = useState<FailureMode[]>([]);
  const [timeline, setTimeline] = useState<Record<string, MaintenanceEvent[]>>({});
  const [reliability, setReliability] = useState<ReliabilityTrends | null>(null);
  const [impact, setImpact] = useState<OeeImpact | null>(null);

  useEffect(() => {
    (async () => {
      const [s, r, fm] = await Promise.all([
        getConditionSeries(assets),
        getRemainingUsefulLife(assets),
        listFailureModes(),
      ]);
      setSeries(s); setRul(r); setModes(fm);
      const asset = assets[0];
      const [tl, rel, imp] = await Promise.all([
        getMaintenanceTimeline(asset),
        getReliabilityTrends(asset),
        getMaintenanceImpact(asset),
      ]);
      setTimeline({ [asset]: tl });
      setReliability(rel); setImpact(imp);
    })();
  }, [assets]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><ActivityIcon className="w-5 h-5" /> Condition Streams</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {series.map(s => (
            <div key={s.assetId} className="rounded-[6px] border border-white/15 bg-white/5 p-4">
              <div className="text-white font-medium mb-2">{s.assetId}</div>
              <div className="text-white/70 text-sm">Vibration/Temp/Amp (last 60m)</div>
              <svg className="w-full h-24 mt-2" viewBox="0 0 200 60" preserveAspectRatio="none" aria-label="Condition sparkline">
                {/* simple vibration line */}
                <polyline fill="none" stroke="#9AE6B4" strokeWidth="1" points={s.samples.map((p, i) => `${(i/59)*200},${60 - (p.vibration_g-0.8)*60}`).join(' ')} />
                {/* temperature */}
                <polyline fill="none" stroke="#93C5FD" strokeWidth="1" points={s.samples.map((p, i) => `${(i/59)*200},${60 - (p.temperature_c-50)*2}`).join(' ')} />
                {/* amperage */}
                <polyline fill="none" stroke="#FBBF24" strokeWidth="1" points={s.samples.map((p, i) => `${(i/59)*200},${60 - (p.amperage_a-6)*10}`).join(' ')} />
              </svg>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><AlertTriangleIcon className="w-5 h-5" /> Remaining Useful Life</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {rul.map(r => (
              <div key={r.assetId} className="flex items-center justify-between text-white/80">
                <span>{r.assetId}</span>
                <span>{r.predictedHours}h • {(r.confidence*100).toFixed(0)}% • {r.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><WrenchIcon className="w-5 h-5" /> Failure Modes</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Mode</TableHead><TableHead className="text-white/70">Signals</TableHead><TableHead className="text-white/70">Fixes</TableHead></TableRow></TableHeader>
              <TableBody>
                {modes.map(m => (
                  <TableRow key={m.id} className="border-white/10">
                    <TableCell className="text-white/80">{m.name}</TableCell>
                    <TableCell className="text-white/80">{m.signals.join(', ')}</TableCell>
                    <TableCell className="text-white/80">{m.standardFixes.join('; ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><ClockIcon className="w-5 h-5" /> Timeline & Reliability</CardTitle></CardHeader>
          <CardContent>
            <div className="text-white/80 text-sm mb-2">Recent for {Object.keys(timeline)[0]}</div>
            <ul className="text-white/70 text-sm space-y-1">
              {(timeline[Object.keys(timeline)[0]] || []).map((e, idx) => (
                <li key={idx}>{new Date(e.at).toLocaleDateString()} — {e.kind}{e.notes ? `: ${e.notes}` : ''}</li>
              ))}
            </ul>
            {reliability && (
              <div className="mt-3">
                <div className="text-white/80 text-sm">MTBF/MTTR trends</div>
                <svg className="w-full h-24" viewBox="0 0 200 60" preserveAspectRatio="none" aria-label="Reliability trends">
                  <polyline fill="none" stroke="#60A5FA" strokeWidth="1.5" points={reliability.labels.map((_, i) => `${(i/(reliability.labels.length-1))*200},${60 - (reliability.mtbfHours[i]-100)}` ).join(' ')} />
                  <polyline fill="none" stroke="#F87171" strokeWidth="1.5" points={reliability.labels.map((_, i) => `${(i/(reliability.labels.length-1))*200},${60 - (reliability.mttrHours[i]*10)}` ).join(' ')} />
                </svg>
              </div>
            )}
            {impact && (
              <div className="mt-2 text-white/80 text-sm">OEE impact — A {impact.availabilityDelta} • P {impact.performanceDelta} • Q {impact.qualityDelta}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
