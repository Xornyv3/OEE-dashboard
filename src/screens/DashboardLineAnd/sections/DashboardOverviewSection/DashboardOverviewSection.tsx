import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Activity, AlertTriangle, Clock, Cpu, RefreshCcw, Users } from "lucide-react";
import {
  getDowntimeAlerts,
  getMachineStatuses,
  getOperatorAssignments,
  getProductionCounts,
  getShiftProgress,
  getTopWorkOrders,
  type DowntimeAlert,
  type MachineStatus,
  type OperatorAssignment,
  type ProductionCounts,
  type ShiftProgress,
  type WorkOrderProgress,
} from "../../../../lib/realtime";

export const DashboardOverviewSection = (): JSX.Element => {
  const [machines, setMachines] = useState<MachineStatus[]>([]);
  const [operators, setOperators] = useState<OperatorAssignment[]>([]);
  const [shift, setShift] = useState<ShiftProgress | null>(null);
  const [orders, setOrders] = useState<WorkOrderProgress[]>([]);
  const [alerts, setAlerts] = useState<DowntimeAlert[]>([]);
  const [counts, setCounts] = useState<ProductionCounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const operatorByMachine = useMemo(() => {
    const map = new Map<string, OperatorAssignment>();
    for (const o of operators) map.set(o.machineId, o);
    return map;
  }, [operators]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [m, o, s, w, d, c] = await Promise.all([
        getMachineStatuses(),
        getOperatorAssignments(),
        getShiftProgress(),
        getTopWorkOrders(),
        getDowntimeAlerts(),
        getProductionCounts(),
      ]);
      setMachines(m);
      setOperators(o);
      setShift(s);
      setOrders(w);
      setAlerts(d);
      setCounts(c);
      setLastUpdate(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
    const id = setInterval(loadAll, 5000);
    return () => clearInterval(id);
  }, []);

  const pctToWidth = (p: number) => {
    if (p >= 100) return "w-full";
    if (p >= 90) return "w-[90%]";
    if (p >= 80) return "w-[80%]";
    if (p >= 70) return "w-[70%]";
    if (p >= 60) return "w-[60%]";
    if (p >= 50) return "w-[50%]";
    if (p >= 40) return "w-[40%]";
    if (p >= 30) return "w-[30%]";
    if (p >= 20) return "w-[20%]";
    if (p > 0) return "w-[10%]";
    return "w-0";
  };

  return (
    <div className="space-y-6">
      {/* Header row: Shift progress + counts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Shift Progress</CardTitle>
                <div className="text-white/60 text-sm">
                  {shift
                    ? `${shift.shiftName} — ${new Date(shift.startedAt).toLocaleTimeString()}–${new Date(shift.endsAt).toLocaleTimeString()}`
                    : "—"}
                </div>
              </div>
            </div>
            <button
              className="text-white/70 hover:text-white text-sm flex items-center gap-2"
              onClick={loadAll}
              title="Refresh now"
              disabled={loading}
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-[#4F4F59] rounded-full h-3">
                  <div className={`h-3 rounded-full bg-white ${pctToWidth(shift?.percent ?? 0)}`}></div>
                </div>
              </div>
              <div className="w-16 text-right text-white/80">{shift?.percent ?? 0}%</div>
            </div>
            <div className="mt-2 text-white/60 text-xs">
              Last update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-xl">Production Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{counts?.total ?? 0}</div>
                <div className="text-white/70 text-xs">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{counts?.good ?? 0}</div>
                <div className="text-white/70 text-xs">Good</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{counts?.scrap ?? 0}</div>
                <div className="text-white/70 text-xs">Scrap</div>
              </div>
            </div>
            {typeof counts?.ratePerHour === "number" && (
              <div className="mt-3 text-center text-white/70 text-sm">Rate: {counts?.ratePerHour} / hr</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Machines + Operators */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">Machines</CardTitle>
            <div className="text-white/60 text-sm">Status and operator assignments</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Machine</TableHead>
                  <TableHead className="text-white/70">Line</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Operator</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((m) => {
                  const op = operatorByMachine.get(m.id);
                  return (
                    <TableRow key={m.id} className="border-white/10">
                      <TableCell className="text-white font-medium">{m.name}</TableCell>
                      <TableCell className="text-white/80">{m.line ?? "—"}</TableCell>
                      <TableCell>
                        {m.on ? (
                          <Badge className="bg-white/15 text-white border border-white/20 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> On
                          </Badge>
                        ) : (
                          <Badge className="bg-white/5 text-white border border-white/30 flex items-center gap-1">
                            <XMark /> Off
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-white/80 flex items-center gap-2">
                        <Users className="w-4 h-4" /> {op?.operator ?? "—"}
                        {op?.role ? ` (${op.role})` : ""}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl">Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((o) => (
              <div key={o.id} className="p-3 rounded-[6px] border border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium">{o.id}</div>
                  <div className="text-white/70 text-sm">
                    {o.completed}/{o.planned}
                  </div>
                </div>
                <div className="text-white/70 text-sm">{o.product}</div>
                <div className="mt-2 w-full bg-[#4F4F59] rounded-full h-2">
                  <div className={`h-2 rounded-full bg-white ${pctToWidth(o.percent)}`}></div>
                </div>
                <div className="mt-1 text-right text-white/70 text-xs">{o.percent}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Downtime / stops */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">Downtime / Stops</CardTitle>
            <div className="text-white/60 text-sm">Active alerts</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-[6px] border border-white/10 bg-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/10 text-white border border-white/20">{a.machineId}</Badge>
                  <div className="text-white">{a.reason}</div>
                </div>
                <div className="text-white/60 text-sm">
                  {new Date(a.startedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-white/60 text-sm">No active alerts</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function XMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
