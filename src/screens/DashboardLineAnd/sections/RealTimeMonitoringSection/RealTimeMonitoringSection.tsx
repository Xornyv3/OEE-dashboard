import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { getMachineStatuses, getProductionCounts, getMinuteOee, getMicroStops, getOeeHeatmap, type MachineStatus, type ProductionCounts, type MinuteOee, type MicroStop, type HeatCell } from "../../../../lib/realtime";
import { listAlerts, ackAlert, routeAlert, escalateAlert, type Alert } from "../../../../lib/alerts";
import { AlertTriangle, Flame, Gauge, Grid, Radio } from "lucide-react";
import { getReferenceStudy, pickScopedBenchmark, type StudyBenchmark } from "../../../../lib/reference";

export const RealTimeMonitoringSection = (): JSX.Element => {
  const [machines, setMachines] = useState<MachineStatus[]>([]);
  const [counts, setCounts] = useState<ProductionCounts | null>(null);
  const [minuteOee, setMinuteOee] = useState<MinuteOee[]>([]);
  const [microStops, setMicroStops] = useState<MicroStop[]>([]);
  const [heat, setHeat] = useState<HeatCell[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [bench, setBench] = useState<StudyBenchmark | null>(null);

  useEffect(() => {
    (async () => {
      const [m, c, moee, ms, h, a, b] = await Promise.all([
        getMachineStatuses(),
        getProductionCounts(),
        getMinuteOee(),
        getMicroStops(),
        getOeeHeatmap(),
        listAlerts(),
        getReferenceStudy(),
      ]);
      setMachines(m); setCounts(c); setMinuteOee(moee); setMicroStops(ms); setHeat(h); setAlerts(a); setBench(pickScopedBenchmark(b, { line: 'Line 1' }));
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Live machine tiles */}
      <Card>
        <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Radio className="w-5 h-5" /> Live Machine Status</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {machines.map((m) => (
            <div key={m.id} className="rounded-[6px] border border-white/15 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white font-medium">{m.name}</div>
                <div className={`w-2.5 h-2.5 rounded-full ${m.on ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
              <div className="text-white/60 text-xs">{m.line}</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-[6px] border border-white/10 bg-white/5 p-2 text-center text-white/80 text-xs">Rate/hr<br/>{counts?.ratePerHour ?? 210}</div>
                <div className="rounded-[6px] border border-white/10 bg-white/5 p-2 text-center text-white/80 text-xs">Good<br/>{counts?.good ?? 0}</div>
                <div className="rounded-[6px] border border-white/10 bg-white/5 p-2 text-center text-white/80 text-xs">Scrap<br/>{counts?.scrap ?? 0}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* OEE by minute */}
      <Card>
  <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Gauge className="w-5 h-5" /> OEE by Minute (last 60){bench?.oeeTargetPct ? <span className="text-white/50 text-sm ml-2">Target ≥ {bench.oeeTargetPct}%</span> : null}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-1 min-w-[720px]">
            {minuteOee.map((m) => (
              <div key={m.minute} title={`${m.minute} OEE ${m.oee}%`} className="w-2 h-16 bg-white/10 flex items-end">
                <svg className="w-2 h-16" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden>
                  <rect x={0} y={100 - Math.max(0, Math.min(100, m.oee))} width={2} height={Math.max(0, Math.min(100, m.oee))} fill="white" />
                </svg>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Micro-stop detection & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Micro-stops</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto hide-scrollbar">
            <Table>
              <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Machine</TableHead><TableHead className="text-white/70">Started</TableHead><TableHead className="text-white/70">Duration</TableHead><TableHead className="text-white/70">Reason</TableHead></TableRow></TableHeader>
              <TableBody>
                {microStops.map(ms => (
                  <TableRow key={`${ms.machineId}-${ms.startedAt}`} className="border-white/10"><TableCell className="text-white/80">{ms.machineId}</TableCell><TableCell className="text-white/80">{new Date(ms.startedAt).toLocaleTimeString()}</TableCell><TableCell className="text-white/80">{Math.round(ms.durationMs/1000)}s</TableCell><TableCell className="text-white/80">{ms.reason ?? '—'}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Grid className="w-5 h-5" /> Heatmap (hour × asset)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1">
              {heat.map(cell => {
                const oee = Math.max(0, Math.min(100, cell.oee));
                const color = oee >= 90
                  ? "bg-emerald-500"
                  : oee >= 80
                  ? "bg-lime-500"
                  : oee >= 70
                  ? "bg-yellow-500"
                  : oee >= 60
                  ? "bg-orange-500"
                  : "bg-red-600";
                return (
                  <div key={`${cell.asset}-${cell.hour}`} title={`${cell.asset} ${cell.hour}:00 OEE ${cell.oee}%`} className={`w-6 h-6 ${color} rounded-[2px]`} />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts feed with routing/escalation */}
      <Card>
        <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Flame className="w-5 h-5" /> Alerts</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto hide-scrollbar">
          <Table>
            <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">When</TableHead><TableHead className="text-white/70">Kind</TableHead><TableHead className="text-white/70">Message</TableHead><TableHead className="text-white/70">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {alerts.map(a => (
                <TableRow key={a.id} className="border-white/10">
                  <TableCell className="text-white/80">{new Date(a.happenedAt).toLocaleString()}</TableCell>
                  <TableCell className="text-white/80">{a.kind}</TableCell>
                  <TableCell className="text-white/80">{a.message}</TableCell>
                  <TableCell className="text-white/80 flex gap-2">
                    <Button variant="outline" size="sm" onClick={async()=>{ await ackAlert(a.id); }}>{a.acknowledged? 'Acked' : 'Ack'}</Button>
                    <Button variant="outline" size="sm" onClick={async()=>{ await routeAlert(a.id, 'maintenance'); }}>Route</Button>
                    <Button variant="outline" size="sm" onClick={async()=>{ await escalateAlert(a.id); }}>Escalate</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
