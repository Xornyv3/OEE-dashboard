import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { DatabaseIcon, RefreshCcwIcon, UsersIcon, CheckCircle2Icon, XCircleIcon, AlertTriangleIcon } from "lucide-react";
import { getActiveUsers, getDatabaseInfo, type ActiveUser, type DatabaseInfo, formatRelative } from "../../../../lib/system";

export const GeneralInfoSection = (): JSX.Element => {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storageKey = "prodex.generalInfo.lastUpdate";
  const [lastUpdate, setLastUpdate] = useState<string | null>(() => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  });

  const statusBadge = useMemo(() => {
    const s = dbInfo?.status;
    if (s === "connected") return { label: "Connected", tone: "bg-white/15 text-white border-white/20" };
    if (s === "degraded") return { label: "Degraded", tone: "bg-white/10 text-white border-white/30" };
    if (s === "disconnected") return { label: "Disconnected", tone: "bg-white/5 text-white border-white/40" };
    return { label: "Unknown", tone: "bg-white/5 text-white border-white/40" };
  }, [dbInfo]);

  const doLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, u] = await Promise.all([getDatabaseInfo(), getActiveUsers()]);
      setDbInfo(d);
      setUsers(u);
      const ts = new Date().toISOString();
      setLastUpdate(ts);
      try { localStorage.setItem(storageKey, ts); } catch {}
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void doLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Database Details */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
              <DatabaseIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Database</CardTitle>
              <div className="text-white/60 text-sm">Description, status and last update</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={doLoad} disabled={loading} className="border-white/20 text-white hover:bg-white/10">
              <RefreshCcwIcon className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-white/70 text-sm mb-1">Description</div>
              <div className="text-white">{dbInfo?.description ?? "—"}</div>
            </div>
            <div>
              <div className="text-white/70 text-sm mb-1">Status</div>
              <div className="flex items-center gap-2">
                {dbInfo?.status === "connected" && <CheckCircle2Icon className="w-4 h-4 text-white" />}
                {dbInfo?.status === "degraded" && <AlertTriangleIcon className="w-4 h-4 text-white" />}
                {dbInfo?.status === "disconnected" && <XCircleIcon className="w-4 h-4 text-white" />}
                <Badge className={`border ${statusBadge.tone}`}>{statusBadge.label}</Badge>
              </div>
            </div>
            <div>
              <div className="text-white/70 text-sm mb-1">Last Update</div>
              <div className="text-white">{lastUpdate ? `${new Date(lastUpdate).toLocaleString()} (${formatRelative(lastUpdate)})` : "—"}</div>
            </div>
          </div>
          {error && (
            <div className="mt-4 text-white/80 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>

      {/* Active Users Table */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
            <UsersIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">Active Users</CardTitle>
            <div className="text-white/60 text-sm">Currently logged-in users</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Role</TableHead>
                  <TableHead className="text-white/70">Email</TableHead>
                  <TableHead className="text-white/70">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="border-white/10">
                    <TableCell className="text-white">{u.name}</TableCell>
                    <TableCell className="text-white/80">{u.role}</TableCell>
                    <TableCell className="text-white/80">{u.email ?? "—"}</TableCell>
                    <TableCell className="text-white/80">{formatRelative(u.lastSeen)}</TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={4} className="text-white/60 text-center py-6">No active users</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};