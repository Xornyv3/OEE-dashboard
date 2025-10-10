import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { AlertTriangle, Activity, BarChart3, Clock, Gauge, Timer, Users, Zap } from "lucide-react";

export const KPIDashboardSection = (): JSX.Element => {
  // UI-only placeholders
  const alerts = [{ id: "AL-001", text: "RPM > 3200 on M-02", time: "09:12" }];
  const today = { production: 1250, good: 1190, scrap: 60, uptime: "86%", availability: "92%" };
  const presence = { present: 42, scheduled: 48, rate: "87.5%" };
  const machines = [
    { id: "M-01", availability: "96%", trs: "78%", trg: "83%", teep: "64%", mttr: "12m", mtbf: "5.8h" },
    { id: "M-02", availability: "88%", trs: "71%", trg: "76%", teep: "58%", mttr: "18m", mtbf: "4.2h" },
  ];
  const times = { cycle: "18s", takt: "22s", lead: "1.8d", va: "73%", nva: "27%" };
  const productivity = { unitsPerLaborHour: 42.3 };

  const bar = (pct: number) => (
    <div className="w-full bg-[#4F4F59] rounded-full h-2"><div className={`h-2 rounded-full bg-white`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>
  );

  return (
    <div className="space-y-6">
      {/* System Alerts + Today’s Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-white" />
            <CardTitle className="text-white text-xl">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a.id} className="p-3 rounded-[6px] border border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="text-white">{a.text}</div>
                  <div className="text-white/60 text-sm">{a.time}</div>
                </div>
              ))}
              {alerts.length === 0 && <div className="text-white/60 text-sm">No alerts</div>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-white" />
            <CardTitle className="text-white text-xl">Today’s Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 rounded-[6px] border border-white/10 bg-white/5"><div className="text-white/60">Production</div><div className="text-white text-xl font-semibold">{today.production}</div></div>
              <div className="p-2 rounded-[6px] border border-white/10 bg-white/5"><div className="text-white/60">Good</div><div className="text-white text-xl font-semibold">{today.good}</div></div>
              <div className="p-2 rounded-[6px] border border-white/10 bg-white/5"><div className="text-white/60">Scrap</div><div className="text-white text-xl font-semibold">{today.scrap}</div></div>
              <div className="p-2 rounded-[6px] border border-white/10 bg-white/5"><div className="text-white/60">Uptime</div><div className="text-white text-xl font-semibold">{today.uptime}</div></div>
              <div className="p-2 rounded-[6px] border border-white/10 bg-white/5 col-span-2"><div className="text-white/60">Availability</div><div className="text-white text-xl font-semibold">{today.availability}</div></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presence rate + Machine availability */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-3"><Users className="w-5 h-5 text-white" /><CardTitle className="text-white text-xl">Presence Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><div className="text-white text-2xl font-semibold">{presence.present}</div><div className="text-white/70 text-xs">Present</div></div>
              <div><div className="text-white text-2xl font-semibold">{presence.scheduled}</div><div className="text-white/70 text-xs">Scheduled</div></div>
              <div><div className="text-white text-2xl font-semibold">{presence.rate}</div><div className="text-white/70 text-xs">Rate</div></div>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center gap-3"><BarChart3 className="w-5 h-5 text-white" /><CardTitle className="text-white text-xl">Machine Availability</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/70">Machine</TableHead>
                    <TableHead className="text-white/70">Availability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machines.map((m) => (
                    <TableRow key={m.id} className="border-white/10">
                      <TableCell className="text-white font-medium">{m.id}</TableCell>
                      <TableCell className="text-white/80">{m.availability}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Order Progress (interactive placeholder) */}
      <Card>
        <CardHeader className="flex items-center gap-3"><Gauge className="w-5 h-5 text-white" /><CardTitle className="text-white text-xl">Working Order Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ id: "WO-001", pct: 76 }, { id: "WO-002", pct: 42 }, { id: "WO-003", pct: 90 }].map((w) => (
              <div key={w.id} className="p-3 rounded-[6px] border border-white/10 bg-white/5">
                <div className="flex items-center justify-between text-white"><span className="font-medium">{w.id}</span><span>{w.pct}%</span></div>
                <div className="mt-2">{bar(w.pct)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TRS/TRG/TEEP + MTTR/MTBF */}
      <Card>
        <CardHeader className="flex items-center gap-3"><Zap className="w-5 h-5 text-white" /><CardTitle className="text-white text-xl">TRS, TRG (no quality), TEEP & Reliability</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Machine</TableHead>
                  <TableHead className="text-white/70">TRS</TableHead>
                  <TableHead className="text-white/70">TRG</TableHead>
                  <TableHead className="text-white/70">TEEP</TableHead>
                  <TableHead className="text-white/70">MTTR</TableHead>
                  <TableHead className="text-white/70">MTBF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((m) => (
                  <TableRow key={m.id} className="border-white/10">
                    <TableCell className="text-white font-medium">{m.id}</TableCell>
                    <TableCell className="text-white/80">{m.trs}</TableCell>
                    <TableCell className="text-white/80">{m.trg}</TableCell>
                    <TableCell className="text-white/80">{m.teep}</TableCell>
                    <TableCell className="text-white/80">{m.mttr}</TableCell>
                    <TableCell className="text-white/80">{m.mtbf}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Time metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-3"><Timer className="w-5 h-5 text-white" /><CardTitle className="text-white text-lg">Cycle Time</CardTitle></CardHeader>
          <CardContent><div className="text-white text-2xl font-semibold">{times.cycle}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3"><Clock className="w-5 h-5 text-white" /><CardTitle className="text-white text-lg">Takt Time</CardTitle></CardHeader>
          <CardContent><div className="text-white text-2xl font-semibold">{times.takt}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3"><Clock className="w-5 h-5 text-white" /><CardTitle className="text-white text-lg">Lead Time</CardTitle></CardHeader>
          <CardContent><div className="text-white text-2xl font-semibold">{times.lead}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3"><Users className="w-5 h-5 text-white" /><CardTitle className="text-white text-lg">Labor Productivity</CardTitle></CardHeader>
          <CardContent><div className="text-white text-2xl font-semibold">{productivity.unitsPerLaborHour}<span className="text-white/70 text-sm"> u/LH</span></div></CardContent>
        </Card>
      </div>
    </div>
  );
};
