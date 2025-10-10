import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

type Machine = {
  id: string;
  name: string;
  line: string;
  rpmMin: number;
  rpmMax: number;
  speedManufacturer: number; // units/min or similar
  speedNominal: number; // production speed
  status: "Online" | "Offline" | "Maintenance";
};

interface MachineManagementSectionProps {
  onGoTo?: (tab: "settings" | "machine-maintenance") => void;
}

export const MachineManagementSection = ({ onGoTo }: MachineManagementSectionProps): JSX.Element => {
  const [machines, setMachines] = useState<Machine[]>([
    { id: "MC-001", name: "Press A1", line: "Line 1", rpmMin: 800, rpmMax: 1200, speedManufacturer: 100, speedNominal: 85, status: "Online" },
    { id: "MC-002", name: "CNC B2", line: "Line 2", rpmMin: 600, rpmMax: 1100, speedManufacturer: 90, speedNominal: 75, status: "Maintenance" },
    { id: "MC-003", name: "Lathe C3", line: "Line 3", rpmMin: 500, rpmMax: 900, speedManufacturer: 80, speedNominal: 70, status: "Offline" },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Machine>>({});

  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    id: "",
    name: "",
    line: "",
    rpmMin: 0,
    rpmMax: 0,
    speedManufacturer: 0,
    speedNominal: 0,
    status: "Offline",
  });

  const canAdd = useMemo(() => {
    return (
      !!newMachine.id && !!newMachine.name && !!newMachine.line &&
      (newMachine.rpmMin as number) >= 0 && (newMachine.rpmMax as number) > 0
    );
  }, [newMachine]);

  const startEdit = (m: Machine) => {
    setEditingId(m.id);
    setDraft({ ...m });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };
  const saveEdit = () => {
    if (!editingId) return;
    setMachines((prev) => prev.map((m) => (m.id === editingId ? { ...(m as Machine), ...(draft as Machine) } : m)));
    cancelEdit();
  };
  const removeMachine = (id: string) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
  };
  const addMachine = () => {
    if (!canAdd) return;
    setMachines((prev) => [
      ...prev,
      {
        id: String(newMachine.id),
        name: String(newMachine.name),
        line: String(newMachine.line),
        rpmMin: Number(newMachine.rpmMin),
        rpmMax: Number(newMachine.rpmMax),
        speedManufacturer: Number(newMachine.speedManufacturer),
        speedNominal: Number(newMachine.speedNominal),
        status: (newMachine.status as Machine["status"]) || "Offline",
      },
    ]);
    setNewMachine({ id: "", name: "", line: "", rpmMin: 0, rpmMax: 0, speedManufacturer: 0, speedNominal: 0, status: "Offline" });
  };

  const rpmInput = (value: number | undefined) => (isNaN(Number(value)) ? 0 : Number(value));

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">Machine Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add new machine */}
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-3 mb-6">
            <Input placeholder="ID" value={newMachine.id as string} onChange={(e) => setNewMachine({ ...newMachine, id: e.target.value })} className="bg-transparent border-white/20 text-white" />
            <Input placeholder="Name" value={newMachine.name as string} onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })} className="bg-transparent border-white/20 text-white" />
            <Input placeholder="Line" value={newMachine.line as string} onChange={(e) => setNewMachine({ ...newMachine, line: e.target.value })} className="bg-transparent border-white/20 text-white" />
            <Input type="number" placeholder="RPM Min" value={newMachine.rpmMin as number} onChange={(e) => setNewMachine({ ...newMachine, rpmMin: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white" />
            <Input type="number" placeholder="RPM Max" value={newMachine.rpmMax as number} onChange={(e) => setNewMachine({ ...newMachine, rpmMax: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white" />
            <Input type="number" placeholder="Speed (Mfg)" value={newMachine.speedManufacturer as number} onChange={(e) => setNewMachine({ ...newMachine, speedManufacturer: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white" />
            <Input type="number" placeholder="Speed (Nominal)" value={newMachine.speedNominal as number} onChange={(e) => setNewMachine({ ...newMachine, speedNominal: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white" />
            <div className="flex items-center">
              <Button disabled={!canAdd} onClick={addMachine}>Add Machine</Button>
            </div>
          </div>

          {/* Machines table */}
          <div className="overflow-x-auto hide-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="border-[#4F4F59]">
                  <TableHead className="text-white/70">ID</TableHead>
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Line</TableHead>
                  <TableHead className="text-white/70">RPM Range</TableHead>
                  <TableHead className="text-white/70">Speed (Mfg vs Nominal)</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Links</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((m) => (
                  <TableRow key={m.id} className="border-[#4F4F59]">
                    <TableCell className="text-white font-medium">{m.id}</TableCell>
                    <TableCell className="text-white/90">
                      {editingId === m.id ? (
                        <Input value={(draft.name as string) || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="bg-transparent border-white/20 text-white h-9" />
                      ) : (
                        m.name
                      )}
                    </TableCell>
                    <TableCell className="text-white/90">
                      {editingId === m.id ? (
                        <Input value={(draft.line as string) || ""} onChange={(e) => setDraft({ ...draft, line: e.target.value })} className="bg-transparent border-white/20 text-white h-9" />
                      ) : (
                        m.line
                      )}
                    </TableCell>
                    <TableCell className="text-white/90">
                      {editingId === m.id ? (
                        <div className="flex gap-2">
                          <Input type="number" value={(draft.rpmMin as number) ?? m.rpmMin} onChange={(e) => setDraft({ ...draft, rpmMin: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white h-9" />
                          <Input type="number" value={(draft.rpmMax as number) ?? m.rpmMax} onChange={(e) => setDraft({ ...draft, rpmMax: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white h-9" />
                        </div>
                      ) : (
                        <span>{m.rpmMin} - {m.rpmMax} rpm</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white/90">
                      {editingId === m.id ? (
                        <div className="flex gap-2">
                          <Input type="number" value={(draft.speedManufacturer as number) ?? m.speedManufacturer} onChange={(e) => setDraft({ ...draft, speedManufacturer: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white h-9" />
                          <Input type="number" value={(draft.speedNominal as number) ?? m.speedNominal} onChange={(e) => setDraft({ ...draft, speedNominal: rpmInput(Number(e.target.value)) })} className="bg-transparent border-white/20 text-white h-9" />
                        </div>
                      ) : (
                        <span>{m.speedManufacturer} / {m.speedNominal}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white/90">{m.status}</TableCell>
                    <TableCell className="text-white/90">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onGoTo?.("settings")}>Settings</Button>
                        <Button variant="outline" size="sm" onClick={() => onGoTo?.("machine-maintenance")}>Maintenance</Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/90">
                      {editingId === m.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit}>Save</Button>
                          <Button size="sm" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(m)}>Edit</Button>
                          <Button size="sm" variant="secondary" onClick={() => removeMachine(m.id)}>Delete</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
