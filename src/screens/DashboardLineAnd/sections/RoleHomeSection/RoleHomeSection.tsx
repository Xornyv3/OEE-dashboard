import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { useAuth } from "../../../../lib/auth";
import { getProductionCounts, getDowntimeAlerts, getTopWorkOrders } from "../../../../lib/realtime";
import { fetchOeeMetrics, type Scope } from "../../../../lib/data";
import { Activity, AlarmClock, BarChart3, Bell, Flag, Globe2, HeartPulse, Languages, LineChart, PieChart, Users } from "lucide-react";

export const RoleHomeSection = (): JSX.Element => {
  const { role } = useAuth();
  const [scope] = useState<Scope>('line');
  const [entity] = useState<string>('Line 1');
  const [oee, setOee] = useState<{ availability: number; performance: number; quality: number; oee: number } | null>(null);
  const [counts, setCounts] = useState<{ total?: number; good: number; scrap: number; ratePerHour?: number } | null>(null);
  const [downtime, setDowntime] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [c, d, wo] = await Promise.all([
        getProductionCounts(),
        getDowntimeAlerts(),
        getTopWorkOrders(),
      ]);
      setCounts(c);
      setDowntime(d);
      setOrders(wo);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const m = await fetchOeeMetrics({ scope, entity, groupBy: 'shift' });
      setOee(m);
    })();
  }, [scope, entity]);

  const Dial = ({ label, value }: { label: string; value?: number }) => (
    <div className="rounded-[6px] border border-white/15 bg-white/5 p-3">
      <div className="text-white/70 text-xs">{label}</div>
      <div className="text-white text-2xl font-semibold">{typeof value === 'number' ? `${value}%` : '—'}</div>
    </div>
  );

  // Maintenance operator: similar to operator but with maintenance focus
  if (role === 'maintenance' || role === 'operator') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2"><Activity className="w-5 h-5" /> Live A/P/Q</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Dial label="Availability" value={oee?.availability} />
            <Dial label="Performance" value={oee?.performance} />
            <Dial label="Quality" value={oee?.quality} />
            <Dial label="OEE" value={oee?.oee} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2"><Flag className="w-5 h-5" /> Target vs Actual</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="rounded-[6px] border border-white/10 bg-white/5 p-3"><div className="text-white/70 text-xs">Target/hr</div><div className="text-white text-xl">{counts?.ratePerHour ?? 210}</div></div>
            <div className="rounded-[6px] border border-white/10 bg-white/5 p-3"><div className="text-white/70 text-xs">Actual/hr</div><div className="text-white text-xl">{Math.round((counts?.ratePerHour ?? 210) * 0.95)}</div></div>
          </CardContent>
        </Card>
        {/* Maintenance quick actions (UI-only) */}
        {role === 'maintenance' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2"><HeartPulse className="w-5 h-5" /> Maintenance Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Create Work Order','Acknowledge Alarm','Request Spare Part'].map(a => (
                <Button key={a} variant="outline" className="justify-start">{a}</Button>
              ))}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2"><AlarmClock className="w-5 h-5" /> Downtime Reason Picker</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['Changeover','Material shortage','Quality check','Safety stop'].map(r => (
              <Button key={r} className="justify-start" variant="outline">{r}</Button>
            ))}
            <Button>One‑tap Andon</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quality manager view
  if (role === 'quality' || role === 'supervisor') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Shift OEE & Top Losses</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Dial label="Availability" value={oee?.availability} />
              <Dial label="Performance" value={oee?.performance} />
              <Dial label="Quality" value={oee?.quality} />
              <Dial label="OEE" value={oee?.oee} />
            </div>
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3">
              <div className="text-white/80 text-sm mb-2">Top Losses (Pareto)</div>
              <div className="text-white/60 text-sm">Setup, Reduced Speed, Minor Stops… (UI stub)</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><PieChart className="w-5 h-5" /> Defects by Category</CardTitle></CardHeader>
          <CardContent className="text-white/70 text-sm">Placeholder for defect categories (e.g., vision detection results, Cp/Cpk chart).</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Users className="w-5 h-5" /> WIP / Staffing vs Plan</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-sm">WIP & Orders</div><div className="text-white/60 text-sm">{orders.length} tracked work orders</div></div>
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-sm">Staffing</div><div className="text-white/60 text-sm">Meets plan (stub)</div></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Bell className="w-5 h-5" /> Alarm Inbox</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20"><TableHead className="text-white/70">Machine</TableHead><TableHead className="text-white/70">Reason</TableHead><TableHead className="text-white/70">Since</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {downtime.map((d) => (
                    <TableRow key={d.id} className="border-white/10"><TableCell className="text-white/80">{d.machineId}</TableCell><TableCell className="text-white/80">{d.reason}</TableCell><TableCell className="text-white/80">{new Date(d.startedAt).toLocaleTimeString()}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Production manager & operations/supply chain managers
  if (role === 'production' || role === 'operations' || role === 'manager') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><LineChart className="w-5 h-5" /> Line vs Plant</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">Line OEE</div><div className="text-white text-xl">{oee?.oee ?? 0}%</div></div>
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">Plant OEE</div><div className="text-white text-xl">82%</div></div>
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">Gap</div><div className="text-white text-xl">{(oee?.oee ?? 0) - 82}%</div></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><PieChart className="w-5 h-5" /> Cost of Loss Waterfall</CardTitle></CardHeader>
          <CardContent className="text-white/70 text-sm">Placeholder for waterfall chart: Availability → Performance → Quality → OEE.</CardContent>
        </Card>
        {role === 'operations' && (
          <Card>
            <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Inventory & Demand</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">Current Inventory</div><div className="text-white text-xl">Balanced (stub)</div></div>
              <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">Forecast Next 7 Days</div><div className="text-white text-xl">Demand ↑2% (stub)</div></div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><HeartPulse className="w-5 h-5" /> Maintenance Compliance & OTIF</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">PM Compliance</div><div className="text-white text-xl">96%</div></div>
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">OTIF Impact</div><div className="text-white text-xl">Minor (stub)</div></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Administrator / Executive control tower
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Globe2 className="w-5 h-5" /> Control Tower — Multi‑site</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {["Site A","Site B","Site C"].map(s => (
            <div key={s} className="rounded-[6px] border border-white/15 bg-white/5 p-3">
              <div className="text-white/70 text-xs">{s}</div>
              <div className="text-white text-xl">OEE {75 + Math.floor(Math.random()*10)}%</div>
              <div className="text-white/60 text-xs">Energy −2% | Scrap −1% (stub)</div>
            </div>
          ))}
        </CardContent>
      </Card>
      {role === 'administrator' && (
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2">System Health & Access</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">API Status</div><div className="text-white text-xl">Healthy</div></div>
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">Users</div><div className="text-white text-xl">Manage (stub)</div></div>
            <div className="rounded-[6px] border border-white/15 bg-white/5 p-3"><div className="text-white/70 text-xs">Settings</div><div className="text-white text-xl">Configure (stub)</div></div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><Languages className="w-5 h-5" /> Multilingual & Accessibility</CardTitle></CardHeader>
        <CardContent className="text-white/70 text-sm">UI designed for mobile, kiosk, large screens. Support for future i18n and A11y (font sizes, contrast, keyboard nav).</CardContent>
      </Card>
    </div>
  );
};
