import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { Users, Filter, Gauge, ClipboardList } from "lucide-react";

type OeeBreakdown = "article" | "sub-article" | "shift" | "work-order";

export const MachineLinePerformanceSection = (): JSX.Element => {
  // UI-only state (no persistence yet)
  const [scope, setScope] = useState<"machine" | "line">("machine");
  const [selection, setSelection] = useState<string>("");
  const [breakdown, setBreakdown] = useState<OeeBreakdown>("article");

  // Placeholder options
  const machineOptions = ["M-01 • CNC Mill A", "M-02 • Lathe B", "M-03 • Robot Arm C"];
  const lineOptions = ["Line 1", "Line 2", "Line 3"];

  // Fake rows for assigned workers and counting comparison
  const workers = [
    { name: "Jane Doe", role: "Operator", shift: "A" },
    { name: "John Smith", role: "Operator", shift: "A" },
    { name: "Alex Lee", role: "Technician", shift: "B" },
  ];

  const counts = [
    { label: "Machine Count", value: 1240 },
    { label: "Personnel Count", value: 1228 },
    { label: "Difference", value: 12 },
  ];

  return (
    <Card className="rounded-[6px] overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-[#191921] border border-[#4F4F59] flex items-center justify-center">
            <Gauge className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-lg">Machine & Line Performance</CardTitle>
            <div className="text-white/60 text-sm">Filter by scope and subdivide OEE</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-white/60 text-sm">
          <Filter className="w-4 h-4" />
          UI only — no data writes
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-white/70 text-sm">Scope</div>
            <Select value={scope} onValueChange={(v) => setScope(v as any)}>
              <SelectTrigger className="h-10 rounded-[6px] border border-[#4F4F59] bg-[#151518] text-white">
                <SelectValue placeholder="Select Scope" />
              </SelectTrigger>
              <SelectContent className="bg-[#151518] border border-[#4F4F59] text-white">
                <SelectItem value="machine" className="text-white data-[highlighted]:bg-[#191921]">Machine</SelectItem>
                <SelectItem value="line" className="text-white data-[highlighted]:bg-[#191921]">Line</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-white/70 text-sm">{scope === "machine" ? "Machine" : "Line"}</div>
            <Select value={selection} onValueChange={setSelection}>
              <SelectTrigger className="h-10 rounded-[6px] border border-[#4F4F59] bg-[#151518] text-white">
                <SelectValue placeholder={`Select ${scope === "machine" ? "Machine" : "Line"}`} />
              </SelectTrigger>
              <SelectContent className="bg-[#151518] border border-[#4F4F59] text-white max-h-64">
                {(scope === "machine" ? machineOptions : lineOptions).map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-white data-[highlighted]:bg-[#191921]">{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-white/70 text-sm">OEE Subdivision</div>
            <Select value={breakdown} onValueChange={(v) => setBreakdown(v as OeeBreakdown)}>
              <SelectTrigger className="h-10 rounded-[6px] border border-[#4F4F59] bg-[#151518] text-white">
                <SelectValue placeholder="Select Subdivision" />
              </SelectTrigger>
              <SelectContent className="bg-[#151518] border border-[#4F4F59] text-white">
                <SelectItem value="article" className="text-white data-[highlighted]:bg-[#191921]">Article</SelectItem>
                <SelectItem value="sub-article" className="text-white data-[highlighted]:bg-[#191921]">Sub-Article</SelectItem>
                <SelectItem value="shift" className="text-white data-[highlighted]:bg-[#191921]">Shift</SelectItem>
                <SelectItem value="work-order" className="text-white data-[highlighted]:bg-[#191921]">Working Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Assigned Workers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            <div className="font-medium">Assigned Workers</div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Role</TableHead>
                  <TableHead className="text-white/70">Shift</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((w, i) => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell className="text-white">{w.name}</TableCell>
                    <TableCell className="text-white/80">{w.role}</TableCell>
                    <TableCell className="text-white/80">{w.shift}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Personnel Counting vs Machine Data */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <ClipboardList className="w-5 h-5" />
            <div className="font-medium">Counting Comparison</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {counts.map((c) => (
              <div key={c.label} className="p-3 rounded-[6px] border border-white/10 bg-white/5">
                <div className="text-white/70 text-xs">{c.label}</div>
                <div className="text-white text-2xl font-semibold">{c.value}</div>
              </div>
            ))}
          </div>
          <div className="text-white/70 text-xs">
            Operators can input personal counts (UI only for now); differences help detect human vs. machine errors.
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white/10 text-white border border-white/20">Article</Badge>
            <Badge className="bg-white/10 text-white border border-white/20">Sub-Article</Badge>
            <Badge className="bg-white/10 text-white border border-white/20">Shift</Badge>
            <Badge className="bg-white/10 text-white border border-white/20">Working Order</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
