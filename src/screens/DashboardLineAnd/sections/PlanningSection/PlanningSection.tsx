import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { useAuth } from "../../../../lib/auth";
import { usePermissions } from "../../../../lib/permissions";
import { fetchArticles, fetchMachines, fetchShiftSlots, fetchAssignments, saveAssignment, deleteAssignment, type Article, type Assignment, type Machine, type ShiftSlot } from "../../../../lib/planning";

export const PlanningSection = (): JSX.Element => {
  useAuth(); // keep context initialized for future use
  const { canEditScheduling } = usePermissions();
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [articles, setArticles] = useState<Article[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [shifts, setShifts] = useState<ShiftSlot[]>([]);
  const [rows, setRows] = useState<Assignment[]>([]);

  const canEdit = !!canEditScheduling;

  useEffect(() => {
    (async () => {
      const [a, m, s] = await Promise.all([fetchArticles(), fetchMachines(), fetchShiftSlots()]);
      setArticles(a); setMachines(m); setShifts(s);
    })();
  }, []);

  useEffect(() => {
    (async () => { setRows(await fetchAssignments(date)); })();
  }, [date]);

  const byShift = useMemo(() => {
    const map: Record<string, Assignment[]> = {};
    for (const sh of shifts) map[sh.name] = [];
    for (const r of rows) { (map[r.shift] ||= []).push(r); }
    return map;
  }, [rows, shifts]);

  const handleAdd = async () => {
    const firstShift = shifts[0]?.name ?? "Morning";
    const firstMachine = machines[0]?.id ?? "M-01";
    const firstArticle = articles[0]?.id ?? "PEN-A";
    const componentId = articles[0]?.components[0]?.id;
    const payload = { date, shift: firstShift, machineId: firstMachine, articleId: firstArticle, componentId, quantity: 100 };
    const res = await saveAssignment(payload);
    if (res.success) setRows(prev => [{ id: res.id, ...payload }, ...prev]);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAssignment(id);
    if (res.success) setRows(prev => prev.filter(x => x.id !== id));
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl">Planning & Scheduling</CardTitle>
            <div className="text-white/60 text-sm">Plan machine orders by shift and work orders (articles/components)</div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              aria-label="Planning date"
              className="h-10 bg-[#191921] text-white border border-[#4F4F59] rounded-[6px] px-3"
            />
            {canEdit && (
              <Button onClick={handleAdd}>New Assignment</Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {shifts.map((sh) => (
          <div key={sh.name} className="space-y-3">
            <div className="text-white font-medium">{sh.name} — {sh.start} → {sh.end}</div>
            <div className="overflow-x-auto hide-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#4F4F59]">
                    <TableHead className="text-white/70">Machine</TableHead>
                    <TableHead className="text-white/70">Article</TableHead>
                    <TableHead className="text-white/70">Component</TableHead>
                    <TableHead className="text-white/70">Qty</TableHead>
                    <TableHead className="text-white/70">Operator</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(byShift[sh.name] ?? []).map((r) => {
                    const article = articles.find(a => a.id === r.articleId);
                    const machine = machines.find(m => m.id === r.machineId);
                    return (
                      <TableRow key={r.id} className="border-[#4F4F59]">
                        <TableCell className="text-white/80">{machine?.name ?? r.machineId}</TableCell>
                        <TableCell className="text-white/80">{article?.name ?? r.articleId}</TableCell>
                        <TableCell className="text-white/80">{article?.components.find(c => c.id === r.componentId)?.name ?? r.componentId ?? "—"}</TableCell>
                        <TableCell className="text-white/80">{r.quantity}</TableCell>
                        <TableCell className="text-white/80">{r.operatorId ?? "—"}</TableCell>
                        <TableCell className="text-white/80">
                          {canEdit ? (
                            <Button variant="ghost" className="text-white/80" onClick={() => handleDelete(r.id)}>Remove</Button>
                          ) : (
                            <span className="text-white/50">View only</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}

        {/* Quick planner row for managers */}
        {canEdit && (
          <div className="p-4 rounded-[6px] border border-white/10 bg-white/5 space-y-3">
            <div className="text-white/80 text-sm font-medium">Quick Plan</div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Select>
                <SelectTrigger className="h-10 bg-[#191921] border-[#4F4F59] text-white"><SelectValue placeholder="Shift" /></SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {shifts.map(s => (<SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-10 bg-[#191921] border-[#4F4F59] text-white"><SelectValue placeholder="Machine" /></SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {machines.map(m => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-10 bg-[#191921] border-[#4F4F59] text-white"><SelectValue placeholder="Article" /></SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {articles.map(a => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input placeholder="Quantity" className="h-10 bg-[#191921] border-[#4F4F59] text-white" />
              <Button>Schedule</Button>
            </div>
            <div className="text-white/50 text-xs">UI only — wire to saveAssignment when fully parameterized.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
