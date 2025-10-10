import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Switch } from "../../../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { LayoutGrid, List, Search, Settings as SettingsIcon, Wrench, Trash2, Pencil } from "lucide-react";

export const SettingsSection = (): JSX.Element => {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: "5",
    notifications: true,
    emailAlerts: false,
    theme: "dark",
    language: "en-US",
    timezone: "UTC-5",
    oeeTarget: "85",
    availabilityTarget: "90",
    performanceTarget: "85",
    qualityTarget: "95",
    idealCycleTimeSec: "18",
  });

  const [rules, setRules] = useState<Array<{ id: string; metric: string; operator: ">" | ">=" | "<" | "<=" | "==" | "!="; value: string; effect: string }>>([
    { id: "r1", metric: "RPM", operator: ">", value: "3200", effect: "downtime" },
  ]);

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const userManagement = [
    { id: 1, name: "John Smith", role: "Administrator", email: "john@company.com", status: "Active" },
    { id: 2, name: "Jane Doe", role: "Operator", email: "jane@company.com", status: "Active" },
    { id: 3, name: "Mike Johnson", role: "Supervisor", email: "mike@company.com", status: "Inactive" },
  ];

  // Machines management (UI-only)
  type SpeedRange = { min: string; max: string };
  type MachineRow = {
    id: string;
    name: string;
    model: string;
    location: string;
    manufacturerRpm: SpeedRange;
    manufacturerSpeed: SpeedRange; // e.g., m/min, pieces/min
    nominalRpm: SpeedRange;
    nominalSpeed: SpeedRange;
  };
  const [machines, setMachines] = useState<MachineRow[]>([
    {
      id: "M-01",
      name: "Line A Cutter",
      model: "LC-200",
      location: "Line A",
      manufacturerRpm: { min: "1000", max: "3500" },
      manufacturerSpeed: { min: "40", max: "120" },
      nominalRpm: { min: "1200", max: "3000" },
      nominalSpeed: { min: "50", max: "100" },
    },
    {
      id: "M-02",
      name: "Line B Packer",
      model: "PK-450",
      location: "Line B",
      manufacturerRpm: { min: "800", max: "3200" },
      manufacturerSpeed: { min: "30", max: "110" },
      nominalRpm: { min: "1000", max: "2800" },
      nominalSpeed: { min: "45", max: "95" },
    },
  ]);

  const updateMachine = (id: string, patch: Partial<MachineRow>) => setMachines(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  const updateRange = (id: string, key: keyof MachineRow, field: keyof SpeedRange, value: string) =>
    setMachines(prev => prev.map(m => m.id === id ? { ...m, [key]: { ...(m[key] as SpeedRange), [field]: value } as any } : m));
  const addMachine = () => setMachines(prev => [
    ...prev,
    {
      id: `M-${String(prev.length + 1).padStart(2, "0")}`,
      name: "New Machine",
      model: "MODEL",
      location: "Line ?",
      manufacturerRpm: { min: "", max: "" },
      manufacturerSpeed: { min: "", max: "" },
      nominalRpm: { min: "", max: "" },
      nominalSpeed: { min: "", max: "" },
    }
  ]);
  const deleteMachine = (id: string) => setMachines(prev => prev.filter(m => m.id !== id));

  // Machines UI state
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [query, setQuery] = useState("");
  const filteredMachines = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return machines;
    return machines.filter(m =>
      m.id.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.model.toLowerCase().includes(q) ||
      (m.location || "").toLowerCase().includes(q)
    );
  }, [machines, query]);

  return (
    <div className="space-y-6">
      {/* Machines Management (UI-only) */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-white text-xl">Machines</CardTitle>
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative">
                <Search className="w-4 h-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by ID, name, model, location" className="pl-9 bg-transparent border-white/20 text-white w-[260px]" />
              </div>
              <div className="inline-flex rounded-[6px] overflow-hidden border border-white/20">
                <Button variant={viewMode==='grid'?undefined:'outline'} className={viewMode==='grid'?"bg-white/15 text-white":"bg-transparent border-0 text-white/80"} onClick={()=>setViewMode('grid')}>
                  <LayoutGrid className="w-4 h-4 mr-2" /> Grid
                </Button>
                <Button variant={viewMode==='table'?undefined:'outline'} className={viewMode==='table'?"bg-white/15 text-white":"bg-transparent border-0 text-white/80"} onClick={()=>setViewMode('table')}>
                  <List className="w-4 h-4 mr-2" /> Table
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={addMachine}>Add Machine</Button>
                <Button variant="outline" className="bg-transparent border-white/20 text-white">Save (UI)</Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMachines.map((m)=> (
                <div key={m.id} className="rounded-[8px] border border-white/15 bg-white/5 p-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-[4px] border border-white/20 bg-white/10 text-white/80 text-xs font-mono">{m.id}</span>
                        <Input value={m.name} onChange={(e)=>updateMachine(m.id,{ name: e.target.value })} className="bg-transparent border-white/20 text-white h-9" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={m.model} onChange={(e)=>updateMachine(m.id,{ model: e.target.value })} className="bg-transparent border-white/20 text-white h-9" placeholder="Model" />
                        <Input value={m.location} onChange={(e)=>updateMachine(m.id,{ location: e.target.value })} className="bg-transparent border-white/20 text-white h-9" placeholder="Location" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white" title="Open Settings"><SettingsIcon className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white" title="Maintenance"><Wrench className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-[6px] border border-white/15 bg-white/5 p-3">
                      <div className="text-white/80 text-sm font-medium mb-2">Manufacturer</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-white/60 text-xs mb-1">RPM (min/max)</div>
                          <div className="flex items-center gap-2">
                            <Input value={m.manufacturerRpm.min} onChange={(e)=>updateRange(m.id,'manufacturerRpm','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white h-9" />
                            <span className="text-white/60">/</span>
                            <Input value={m.manufacturerRpm.max} onChange={(e)=>updateRange(m.id,'manufacturerRpm','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white h-9" />
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60 text-xs mb-1">Speed (min/max)</div>
                          <div className="flex items-center gap-2">
                            <Input value={m.manufacturerSpeed.min} onChange={(e)=>updateRange(m.id,'manufacturerSpeed','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white h-9" />
                            <span className="text-white/60">/</span>
                            <Input value={m.manufacturerSpeed.max} onChange={(e)=>updateRange(m.id,'manufacturerSpeed','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white h-9" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[6px] border border-white/15 bg-white/5 p-3">
                      <div className="text-white/80 text-sm font-medium mb-2">Nominal Production</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-white/60 text-xs mb-1">RPM (min/max)</div>
                          <div className="flex items-center gap-2">
                            <Input value={m.nominalRpm.min} onChange={(e)=>updateRange(m.id,'nominalRpm','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white h-9" />
                            <span className="text-white/60">/</span>
                            <Input value={m.nominalRpm.max} onChange={(e)=>updateRange(m.id,'nominalRpm','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white h-9" />
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60 text-xs mb-1">Speed (min/max)</div>
                          <div className="flex items-center gap-2">
                            <Input value={m.nominalSpeed.min} onChange={(e)=>updateRange(m.id,'nominalSpeed','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white h-9" />
                            <span className="text-white/60">/</span>
                            <Input value={m.nominalSpeed.max} onChange={(e)=>updateRange(m.id,'nominalSpeed','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white h-9" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-white/60 text-xs">UI-only • Not saved</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white"><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
                      <Button variant="outline" size="sm" className="bg-transparent border-red-500/20 text-red-400" onClick={()=>deleteMachine(m.id)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMachines.length === 0 && (
                <div className="text-white/60 text-sm">No machines match your search.</div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white/70">ID</TableHead>
                    <TableHead className="text-white/70">Name</TableHead>
                    <TableHead className="text-white/70">Model</TableHead>
                    <TableHead className="text-white/70">Location</TableHead>
                    <TableHead className="text-white/70">Mfg RPM</TableHead>
                    <TableHead className="text-white/70">Mfg Speed</TableHead>
                    <TableHead className="text-white/70">Nominal RPM</TableHead>
                    <TableHead className="text-white/70">Nominal Speed</TableHead>
                    <TableHead className="text-white/70">Links</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMachines.map((m)=> (
                    <TableRow key={m.id} className="border-white/10">
                      <TableCell className="text-white/80">{m.id}</TableCell>
                      <TableCell><Input value={m.name} onChange={(e)=>updateMachine(m.id,{ name: e.target.value })} className="bg-transparent border-white/20 text-white" /></TableCell>
                      <TableCell><Input value={m.model} onChange={(e)=>updateMachine(m.id,{ model: e.target.value })} className="bg-transparent border-white/20 text-white" /></TableCell>
                      <TableCell><Input value={m.location} onChange={(e)=>updateMachine(m.id,{ location: e.target.value })} className="bg-transparent border-white/20 text-white" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input value={m.manufacturerRpm.min} onChange={(e)=>updateRange(m.id,'manufacturerRpm','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white w-24" />
                          <span className="text-white/60">/</span>
                          <Input value={m.manufacturerRpm.max} onChange={(e)=>updateRange(m.id,'manufacturerRpm','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input value={m.manufacturerSpeed.min} onChange={(e)=>updateRange(m.id,'manufacturerSpeed','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white w-24" />
                          <span className="text-white/60">/</span>
                          <Input value={m.manufacturerSpeed.max} onChange={(e)=>updateRange(m.id,'manufacturerSpeed','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input value={m.nominalRpm.min} onChange={(e)=>updateRange(m.id,'nominalRpm','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white w-24" />
                          <span className="text-white/60">/</span>
                          <Input value={m.nominalRpm.max} onChange={(e)=>updateRange(m.id,'nominalRpm','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input value={m.nominalSpeed.min} onChange={(e)=>updateRange(m.id,'nominalSpeed','min', e.target.value)} placeholder="min" className="bg-transparent border-white/20 text-white w-24" />
                          <span className="text-white/60">/</span>
                          <Input value={m.nominalSpeed.max} onChange={(e)=>updateRange(m.id,'nominalSpeed','max', e.target.value)} placeholder="max" className="bg-transparent border-white/20 text-white w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white"><SettingsIcon className="w-4 h-4 mr-1" /> Settings</Button>
                          <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white"><Wrench className="w-4 h-4 mr-1" /> Maintenance</Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white"><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
                          <Button variant="outline" size="sm" className="bg-transparent border-red-500/20 text-red-400" onClick={()=>deleteMachine(m.id)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Special Rules (UI-only) */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">Special Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 text-white/70 text-sm">
                  <th className="text-left p-2">Metric</th>
                  <th className="text-left p-2">Operator</th>
                  <th className="text-left p-2">Value</th>
                  <th className="text-left p-2">Effect</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id} className="border-b border-white/10">
                    <td className="p-2">
                      <Input value={r.metric} onChange={(e)=>setRules(prev=>prev.map(x=>x.id===r.id?{...x, metric:e.target.value}:x))} className="bg-transparent border-white/20 text-white" placeholder="RPM" />
                    </td>
                    <td className="p-2">
                      <Select value={r.operator} onValueChange={(v)=>setRules(prev=>prev.map(x=>x.id===r.id?{...x, operator:v as any}:x))}>
                        <SelectTrigger className="bg-white border-gray-200 text-black h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {[[">","Greater than"],[">=","Greater or equal"],["<","Less than"],["<=","Less or equal"],["==","Equals"],["!=","Not equal"]].map(([val,label])=> (
                            <SelectItem key={val} value={val} className="text-black hover:bg-gray-100 data-[highlighted]:bg-gray-100">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input value={r.value} onChange={(e)=>setRules(prev=>prev.map(x=>x.id===r.id?{...x, value:e.target.value}:x))} className="bg-transparent border-white/20 text-white" placeholder="3200" />
                    </td>
                    <td className="p-2">
                      <Select value={r.effect} onValueChange={(v)=>setRules(prev=>prev.map(x=>x.id===r.id?{...x, effect:v}:x))}>
                        <SelectTrigger className="bg-white border-gray-200 text-black h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="downtime" className="text-black hover:bg-gray-100 data-[highlighted]:bg-gray-100">Mark as Downtime</SelectItem>
                          <SelectItem value="alert" className="text-black hover:bg-gray-100 data-[highlighted]:bg-gray-100">Raise Alert</SelectItem>
                          <SelectItem value="ignore" className="text-black hover:bg-gray-100 data-[highlighted]:bg-gray-100">Ignore</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white" onClick={()=>setRules(prev=>prev.filter(x=>x.id!==r.id))}>Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent border-white/20 text-white" onClick={()=>setRules(prev=>[...prev,{ id: crypto.randomUUID(), metric: "RPM", operator: ">", value: "3200", effect: "downtime" }])}>Add Rule</Button>
            <Button>Save Rules (UI)</Button>
          </div>
        </CardContent>
      </Card>
      {/* General Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Auto Refresh</label>
                  <p className="text-white/70 text-sm">Automatically refresh dashboard data</p>
                </div>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => handleSettingChange("autoRefresh", checked)}
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Refresh Interval (seconds)</label>
                <Select value={settings.refreshInterval} onValueChange={(value) => handleSettingChange("refreshInterval", value)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="5" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">5 seconds</SelectItem>
                    <SelectItem value="10" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">10 seconds</SelectItem>
                    <SelectItem value="30" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">30 seconds</SelectItem>
                    <SelectItem value="60" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">1 minute</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Theme</label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="dark" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">Dark</SelectItem>
                    <SelectItem value="light" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">Light</SelectItem>
                    <SelectItem value="auto" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Notifications</label>
                  <p className="text-white/70 text-sm">Show system notifications</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Email Alerts</label>
                  <p className="text-white/70 text-sm">Send alerts via email</p>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => handleSettingChange("emailAlerts", checked)}
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Language</label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="en-US" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">English (US)</SelectItem>
                    <SelectItem value="en-GB" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">English (UK)</SelectItem>
                    <SelectItem value="es-ES" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">Spanish</SelectItem>
                    <SelectItem value="fr-FR" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">French</SelectItem>
                    <SelectItem value="de-DE" className="text-black hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OEE Targets */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">OEE Target Settings & Ideal Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Overall OEE Target (%)</label>
              <Input
                type="number"
                value={settings.oeeTarget}
                onChange={(e) => handleSettingChange("oeeTarget", e.target.value)}
                className="bg-transparent border-white/20 text-white"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Availability Target (%)</label>
              <Input
                type="number"
                value={settings.availabilityTarget}
                onChange={(e) => handleSettingChange("availabilityTarget", e.target.value)}
                className="bg-transparent border-white/20 text-white"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Performance Target (%)</label>
              <Input
                type="number"
                value={settings.performanceTarget}
                onChange={(e) => handleSettingChange("performanceTarget", e.target.value)}
                className="bg-transparent border-white/20 text-white"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Quality Target (%)</label>
              <Input
                type="number"
                value={settings.qualityTarget}
                onChange={(e) => handleSettingChange("qualityTarget", e.target.value)}
                className="bg-transparent border-white/20 text-white"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Ideal Cycle Time (sec)</label>
              <Input
                type="number"
                value={settings.idealCycleTimeSec}
                onChange={(e) => handleSettingChange("idealCycleTimeSec", e.target.value)}
                className="bg-transparent border-white/20 text-white"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-xl">User Management</CardTitle>
            <Button>
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white/70 p-3">Name</th>
                  <th className="text-left text-white/70 p-3">Role</th>
                  <th className="text-left text-white/70 p-3">Email</th>
                  <th className="text-left text-white/70 p-3">Status</th>
                  <th className="text-left text-white/70 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userManagement.map((user) => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="text-white font-medium p-3">{user.name}</td>
                    <td className="text-white p-3">{user.role}</td>
                    <td className="text-white p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent border-red-500/20 text-red-400">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">System Version:</span>
                <span className="text-white">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Database Version:</span>
                <span className="text-white">PostgreSQL 14.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Last Backup:</span>
                <span className="text-white">2024-12-08 02:00:00</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Uptime:</span>
                <span className="text-white">15 days, 8 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Active Connections:</span>
                <span className="text-white">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Storage Used:</span>
                <span className="text-white">2.4 GB / 10 GB</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="bg-transparent border-white/20 text-white">
          Reset to Defaults
        </Button>
        <Button>
          Save Settings
        </Button>
      </div>
    </div>
  );
};