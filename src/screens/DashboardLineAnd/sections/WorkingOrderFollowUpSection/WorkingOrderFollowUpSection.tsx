import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { cancelWorkOrder, fetchItemDetails, fetchShiftTypes, type ItemDetails, type ShiftInfo } from "../../../../lib/erpnext";
import { Separator } from "../../../../components/ui/separator";
import { ClipboardList, Download, Users as UsersIcon, Timer, OctagonX } from "lucide-react";
import { useAuth } from "../../../../lib/auth";
import { usePermissions } from "../../../../lib/permissions";
import { getIntegrityPolicy } from "../../../../lib/integrity";

export const WorkingOrderFollowUpSection = (): JSX.Element => {
  useAuth();
  const { canEditScheduling } = usePermissions();
  const viewOnly = !canEditScheduling;
  const [manualDisabled, setManualDisabled] = useState<boolean>(true);
  useEffect(() => { getIntegrityPolicy().then(p => setManualDisabled(p.manualCountsDisabled)); }, []);
  // Local state for orders (could be fetched later)
  const [orders, setOrders] = useState<Array<{
    id: string; product: string; priority: string; status: string; progress: number; startDate: string; dueDate: string; assignedLine: string; plannedQty: number; completedQty: number;
  }>>([
    {
      id: "WO-2024-001",
      product: "Engine Block A1",
      priority: "High",
      status: "In Progress",
      progress: 75,
      startDate: "2024-12-07",
      dueDate: "2024-12-10",
      assignedLine: "Line 1",
      plannedQty: 500,
      completedQty: 375,
    },
    {
      id: "WO-2024-002", 
      product: "Transmission Case B2",
      priority: "Medium",
      status: "Pending",
      progress: 0,
      startDate: "2024-12-09",
      dueDate: "2024-12-12",
      assignedLine: "Line 2",
      plannedQty: 300,
      completedQty: 0,
    },
    {
      id: "WO-2024-003",
      product: "Cylinder Head C3",
      priority: "Low",
      status: "Completed",
      progress: 100,
      startDate: "2024-12-05",
      dueDate: "2024-12-08",
      assignedLine: "Line 3",
      plannedQty: 200,
      completedQty: 200,
    },
  ]);

  // Shift parameterization
  const [shiftMode, setShiftMode] = useState<"manual" | "erp">(() => (localStorage.getItem("but.shiftMode") as any) || "manual");
  const [manualShift, setManualShift] = useState<{ name: string; start: string; end: string; breakMinutes: string }>(() => {
  const saved = localStorage.getItem("but.shiftManual");
    return saved ? JSON.parse(saved) : { name: "Custom", start: "06:00", end: "14:00", breakMinutes: "30" };
  });
  const [erpShifts, setErpShifts] = useState<ShiftInfo[]>([]);
  const [selectedErpShift, setSelectedErpShift] = useState<string>(() => localStorage.getItem("but.shiftErpSelected") || "");

  useEffect(() => {
    if (shiftMode === "erp") {
      fetchShiftTypes().then(setErpShifts).catch(() => setErpShifts([]));
    }
  }, [shiftMode]);

  useEffect(() => {
  localStorage.setItem("but.shiftMode", shiftMode);
  }, [shiftMode]);
  useEffect(() => {
  localStorage.setItem("but.shiftManual", JSON.stringify(manualShift));
  }, [manualShift]);
  useEffect(() => {
  localStorage.setItem("but.shiftErpSelected", selectedErpShift);
  }, [selectedErpShift]);

  const appliedShift = useMemo(() => {
    if (shiftMode === "manual") {
      return { name: manualShift.name || "Custom", start: manualShift.start, end: manualShift.end, breakMinutes: Number(manualShift.breakMinutes) || 0 };
    }
    const found = erpShifts.find(s => s.name === selectedErpShift);
    return found || (erpShifts[0] ?? { name: "—", start: "—", end: "—", breakMinutes: 0 });
  }, [shiftMode, manualShift, selectedErpShift, erpShifts]);

  // Article details
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  useEffect(() => {
    if (!selectedProduct) { setItemDetails(null); return; }
    let cancelled = false;
    fetchItemDetails(selectedProduct).then((d) => { if (!cancelled) setItemDetails(d); }).catch(() => { if (!cancelled) setItemDetails(null); });
    return () => { cancelled = true; };
  }, [selectedProduct]);

  // Map priority to badge variant using status tokens
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "danger"; // red tokens
      case "Medium":
        return "warning"; // orange tokens
      case "Low":
        return "info"; // blue tokens (least severe)
      default:
        return "subtle";
    }
  };

  // Map status to badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "In Progress":
        return "info";
      case "Pending":
        return "warning";
      case "Completed":
        return "success";
      case "Overdue":
        return "danger";
      default:
        return "subtle";
    }
  };

  // Map numeric percentage to a width class to avoid inline styles
  const widthClassFor = (pct: number) => {
    if (pct >= 100) return "w-full";
    if (pct >= 90) return "w-[90%]";
    if (pct >= 80) return "w-[80%]";
    if (pct >= 75) return "w-[75%]";
    if (pct >= 60) return "w-[60%]";
    if (pct >= 50) return "w-[50%]";
    if (pct >= 40) return "w-[40%]";
    if (pct >= 25) return "w-[25%]";
    if (pct > 0) return "w-[10%]";
    return "w-0";
  };

  const doCancel = async (id: string) => {
    const ok = confirm(`Cancel work order ${id}?`);
    if (!ok) return;
    const res = await cancelWorkOrder(id);
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Cancelled", progress: 0 } : o));
      alert(`Order ${id} cancelled${res.message ? ": " + res.message : ""}`);
    } else {
      alert(`Failed to cancel ${id}${res.message ? ": " + res.message : ""}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Working Order + ERP/CRM Import (UI-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-3">
            <ClipboardList className="w-5 h-5" /> Production Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-white/70 text-xs mb-1">Order ID</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" placeholder="WO-YYYY-###" />
            </div>
            <div>
              <div className="text-white/70 text-xs mb-1">Product</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" placeholder="Article name/code" />
            </div>
            <div>
              <div className="text-white/70 text-xs mb-1">Assigned Line</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" placeholder="Line 1" />
            </div>
          </div>
          <div className="flex gap-3">
            {!viewOnly && (
              <Button className="bg-white text-black hover:bg-white/90">Create (UI)</Button>
            )}
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Import from ERP/CRM (UI)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personnel assignments per shift (UI-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-3">
            <UsersIcon className="w-5 h-5" /> Personnel Assignments by Shift
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-white/70 text-xs mb-1">Shift</div>
              <Select>
                <SelectTrigger className="h-10 bg-[#191921] border-[#4F4F59] text-white">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent className="bg-[#191921] border-[#4F4F59] text-white">
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-white/70 text-xs mb-1">Line/Machine</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" placeholder="Line 1 / M-01" />
            </div>
            <div>
              <div className="text-white/70 text-xs mb-1">Worker</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" placeholder="Full name" />
            </div>
            <div className="flex items-end">
              {!viewOnly && <Button className="w-full bg-white text-black hover:bg-white/90">Assign (UI)</Button>}
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#4F4F59]">
                  <TableHead className="text-white/70">Shift</TableHead>
                  <TableHead className="text-white/70">Line/Machine</TableHead>
                  <TableHead className="text-white/70">Worker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-[#4F4F59]"><TableCell className="text-white/80">A</TableCell><TableCell className="text-white/80">Line 1 / M-01</TableCell><TableCell className="text-white/80">Jane Doe</TableCell></TableRow>
                <TableRow className="border-[#4F4F59]"><TableCell className="text-white/80">A</TableCell><TableCell className="text-white/80">Line 1 / M-02</TableCell><TableCell className="text-white/80">John Smith</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Manual Downtime/Stops entry (independent variables) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-3">
            <Timer className="w-5 h-5" /> Manual Downtime / Stops (UI)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {manualDisabled && <div className="text-white/70 text-sm">Manual capture disabled by integrity policy. Use connectors.</div>}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-white/70 text-xs mb-1">Line/Machine</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" placeholder="Line 1 / M-01" disabled={manualDisabled} />
            </div>
            <div>
              <div className="text-white/70 text-xs mb-1">Reason</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" placeholder="Emergency stop" disabled={manualDisabled} />
            </div>
            <div>
              <div className="text-white/70 text-xs mb-1">Duration (min)</div>
              <Input className="bg-[#191921] border-[#4F4F59] text-white" inputMode="numeric" placeholder="10" disabled={manualDisabled} />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-white text-black hover:bg-white/90" disabled={manualDisabled}>Add (UI)</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#4F4F59]">
                  <TableHead className="text-white/70">Line/Machine</TableHead>
                  <TableHead className="text-white/70">Reason</TableHead>
                  <TableHead className="text-white/70">Duration</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-[#4F4F59]">
                  <TableCell className="text-white/80">Line 1 / M-02</TableCell>
                  <TableCell className="text-white/80">Emergency stop pressed</TableCell>
                  <TableCell className="text-white/80">10</TableCell>
                  <TableCell>
                    {!viewOnly ? (
                      <Button variant="ghost" size="sm" className="text-white/80 hover:text-white flex items-center gap-2">
                        <OctagonX className="w-4 h-4" /> Remove
                      </Button>
                    ) : (
                      <span className="text-white/50 text-xs">View only</span>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Separator className="bg-white/10" />
          <div className="text-white/70 text-xs">
            These manual entries are treated as independent variables to compare human vs. machine errors later. (UI only)
          </div>
        </CardContent>
      </Card>
      {/* Shift Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl">Shift Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-white/70 text-sm">Source</label>
              <Select value={shiftMode} onValueChange={(v) => setShiftMode(v as any)}>
                <SelectTrigger className="h-10 bg-[#191921] border-[#4F4F59] text-white">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-[#191921] border-[#4F4F59] text-white">
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="erp">ERPNext</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {shiftMode === "manual" ? (
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-white/70 text-xs mb-1">Shift Name</div>
                  <Input className="bg-[#191921] border-[#4F4F59] text-white" value={manualShift.name} onChange={(e)=>setManualShift({ ...manualShift, name: e.target.value })} />
                </div>
                <div>
                  <div className="text-white/70 text-xs mb-1">Start</div>
                  <Input className="bg-[#191921] border-[#4F4F59] text-white" value={manualShift.start} onChange={(e)=>setManualShift({ ...manualShift, start: e.target.value })} placeholder="HH:mm" />
                </div>
                <div>
                  <div className="text-white/70 text-xs mb-1">End</div>
                  <Input className="bg-[#191921] border-[#4F4F59] text-white" value={manualShift.end} onChange={(e)=>setManualShift({ ...manualShift, end: e.target.value })} placeholder="HH:mm" />
                </div>
                <div>
                  <div className="text-white/70 text-xs mb-1">Break (min)</div>
                  <Input className="bg-[#191921] border-[#4F4F59] text-white" value={manualShift.breakMinutes} onChange={(e)=>setManualShift({ ...manualShift, breakMinutes: e.target.value })} inputMode="numeric" />
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="text-white/70 text-xs mb-1">ERP Shift</div>
                  <Select value={selectedErpShift} onValueChange={setSelectedErpShift}>
                    <SelectTrigger className="h-10 bg-[#191921] border-[#4F4F59] text-white">
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#191921] border-[#4F4F59] text-white max-h-60">
                      {erpShifts.map((s)=> (
                        <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-white/70 text-xs mb-1">Start</div>
                  <div className="h-10 flex items-center px-3 rounded-[6px] border border-[#4F4F59] bg-[#191921] text-white">{appliedShift.start}</div>
                </div>
                <div>
                  <div className="text-white/70 text-xs mb-1">End</div>
                  <div className="h-10 flex items-center px-3 rounded-[6px] border border-[#4F4F59] bg-[#191921] text-white">{appliedShift.end}</div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 text-white/70 text-sm">Applied: <span className="text-white font-medium">{appliedShift.name}</span> — {appliedShift.start}–{appliedShift.end} ({appliedShift.breakMinutes ?? 0} min break)</div>
        </CardContent>
      </Card>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-white/70 text-sm">Active Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">15</div>
            <div className="text-white/70 text-sm">Completed Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-white/70 text-sm">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-white/70 text-sm">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table + Article Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-2">
        <CardHeader>
            <div className="flex justify-between items-center">
            <CardTitle className="text-white text-xl">Work Order Follow-up</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">Export</Button>
                {!viewOnly && <Button>New Order</Button>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto hide-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="border-[#4F4F59]">
                  <TableHead className="text-white/70">Order ID</TableHead>
                  <TableHead className="text-white/70">Product</TableHead>
                  <TableHead className="text-white/70">Priority</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Progress</TableHead>
                  <TableHead className="text-white/70">Line</TableHead>
                  <TableHead className="text-white/70">Quantity</TableHead>
                  <TableHead className="text-white/70">Due Date</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={index} className="border-[#4F4F59]">
                    <TableCell className="text-white font-medium">{order.id}</TableCell>
                    <TableCell className="text-white">
                      <button className="underline underline-offset-2 hover:text-white/80" onClick={()=>setSelectedProduct(order.product)} title="View article details">
                        {order.product}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(order.priority)}>{order.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#4F4F59] rounded-full h-2">
                          <div className={`h-2 rounded-full bg-white ${widthClassFor(order.progress)}`}></div>
                        </div>
                        <span className="text-white/70 text-sm">{order.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{order.assignedLine}</TableCell>
                    <TableCell className="text-white">{order.completedQty}/{order.plannedQty}</TableCell>
                    <TableCell className="text-white">{order.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={()=>setSelectedProduct(order.product)}>Details</Button>
                        {order.status !== "Cancelled" && (
                          <Button variant="ghost" size="sm" onClick={()=>doCancel(order.id)}>Cancel</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Article Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl">Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedProduct ? (
            itemDetails ? (
              <div className="space-y-4">
                {itemDetails.imageUrl && (
                  <div className="w-full h-40 rounded-[6px] overflow-hidden border border-[#4F4F59] bg-[#191921] flex items-center justify-center">
                    <img src={itemDetails.imageUrl} alt={itemDetails.name} className="max-h-40 object-contain" />
                  </div>
                )}
                <div className="text-white font-medium">{itemDetails.name}</div>
                {itemDetails.description && <div className="text-white/70 text-sm">{itemDetails.description}</div>}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {itemDetails.dimensions && (
                    <div className="p-2 rounded-[6px] border border-[#4F4F59] bg-[#191921]"><div className="text-white/60">Dimensions</div><div className="text-white">{itemDetails.dimensions}</div></div>
                  )}
                  {itemDetails.weight && (
                    <div className="p-2 rounded-[6px] border border-[#4F4F59] bg-[#191921]"><div className="text-white/60">Weight</div><div className="text-white">{itemDetails.weight}</div></div>
                  )}
                  {itemDetails.uom && (
                    <div className="p-2 rounded-[6px] border border-[#4F4F59] bg-[#191921]"><div className="text-white/60">UOM</div><div className="text-white">{itemDetails.uom}</div></div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={()=>setSelectedProduct("")}>Close</Button>
                </div>
              </div>
            ) : (
              <div className="text-white/70">Loading details for <span className="text-white">{selectedProduct}</span>…</div>
            )
          ) : (
            <div className="text-white/70">Select a product to see article details from ERP.</div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};