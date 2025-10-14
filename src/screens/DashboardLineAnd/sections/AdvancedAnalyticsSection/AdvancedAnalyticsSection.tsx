import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { getRootCauseInsights, listPrescriptivePlays, simulateWhatIf, getDynamicTargets, type RootCauseInsight, type PrescriptivePlay, type WhatIfInput, type WhatIfResult, type DynamicTarget } from "../../../../lib/analytics";
import { Button } from "../../../../components/ui/button";

export const AdvancedAnalyticsSection = (): JSX.Element => {
  const [insights, setInsights] = useState<RootCauseInsight[]>([]);
  const [plays, setPlays] = useState<PrescriptivePlay[]>([]);
  const [whatIf, setWhatIf] = useState<WhatIfInput>({ crew: 3, speedPct: 100 });
  const [sim, setSim] = useState<WhatIfResult | null>(null);
  const [targets, setTargets] = useState<DynamicTarget[]>([]);

  useEffect(() => {
    (async () => {
      const [rc, pl, tg] = await Promise.all([
        getRootCauseInsights('shift'),
        listPrescriptivePlays(),
        getDynamicTargets(),
      ]);
      setInsights(rc); setPlays(pl); setTargets(tg);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-white text-xl">Root-cause discovery</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Loss</TableHead><TableHead className="text-white/70">Est. OEE points</TableHead><TableHead className="text-white/70">Top contributions</TableHead></TableRow></TableHeader>
            <TableBody>
              {insights.map((i, idx) => (
                <TableRow key={idx} className="border-white/10">
                  <TableCell className="text-white/80">{i.loss}</TableCell>
                  <TableCell className="text-white/80">{i.estimatedPoints}</TableCell>
                  <TableCell className="text-white/80 text-sm">{i.contributions.map(c => `${c.factor} (${c.impactPoints}${c.shap !== undefined ? `, shap ${c.shap}` : ''})`).join(' • ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">Prescriptive plays</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Action</TableHead><TableHead className="text-white/70">Δ OEE</TableHead><TableHead className="text-white/70">Confidence</TableHead></TableRow></TableHeader>
              <TableBody>
                {plays.map((p) => (
                  <TableRow key={p.id} className="border-white/10">
                    <TableCell className="text-white/80">{p.action}</TableCell>
                    <TableCell className="text-white/80">{p.expectedDeltaOee}</TableCell>
                    <TableCell className="text-white/80">{Math.round(p.confidence*100)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">What-if simulator</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 mb-3">
              <div>
                <div className="text-white/70 text-sm">Crew</div>
                <input aria-label="Crew" type="number" min={1} max={8} value={whatIf.crew} onChange={e=>setWhatIf({ ...whatIf, crew: Number(e.currentTarget.value) })} className="bg-white/5 border border-white/10 rounded-[6px] px-2 py-1 text-white/90 w-20" />
              </div>
              <div>
                <div className="text-white/70 text-sm">Speed %</div>
                <input aria-label="Speed percent" type="number" min={60} max={130} value={whatIf.speedPct} onChange={e=>setWhatIf({ ...whatIf, speedPct: Number(e.currentTarget.value) })} className="bg-white/5 border border-white/10 rounded-[6px] px-2 py-1 text-white/90 w-24" />
              </div>
              <div>
                <div className="text-white/70 text-sm">Maintenance at</div>
                <input aria-label="Maintenance datetime" type="datetime-local" onChange={e=>setWhatIf({ ...whatIf, maintenanceAt: e.currentTarget.value || undefined })} className="bg-white/5 border border-white/10 rounded-[6px] px-2 py-1 text-white/90" />
              </div>
              <Button onClick={async()=>{ const r = await simulateWhatIf(whatIf); setSim(r); }}>Simulate</Button>
            </div>
            {sim && (
              <div className="text-white/80 text-sm">Predicted OEE: {sim.predictedOee} — {sim.details.map(d=>`${d.factor} ${d.deltaPoints}`).join(' • ')}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-white text-xl">Dynamic targets</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Scope</TableHead><TableHead className="text-white/70">Key</TableHead><TableHead className="text-white/70">OEE Target</TableHead><TableHead className="text-white/70">Updated</TableHead></TableRow></TableHeader>
            <TableBody>
              {targets.map((t, idx) => (
                <TableRow key={idx} className="border-white/10">
                  <TableCell className="text-white/80">{t.scope}</TableCell>
                  <TableCell className="text-white/80">{t.key}</TableCell>
                  <TableCell className="text-white/80">{t.oeeTarget}</TableCell>
                  <TableCell className="text-white/80">{new Date(t.lastUpdated).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
