import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ClipboardList } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";

export const ErrorRateChartSection = (): JSX.Element => {
  const tableData = [
    {
      id: "01",
      machine: "Machine A1",
      operator: "John Doe",
      shift: "Morning",
      status: "Running",
      efficiency: "95%",
      output: "150",
    },
    {
      id: "02", 
      machine: "Machine B2",
      operator: "Jane Smith",
      shift: "Afternoon",
      status: "Maintenance",
      efficiency: "0%",
      output: "0",
    },
    {
      id: "03",
      machine: "Machine C3", 
      operator: "Mike Johnson",
      shift: "Night",
      status: "Running",
      efficiency: "87%",
      output: "130",
    },
  ];

  return (
    <Card className="rounded-[6px]">
      <CardHeader>
        <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center"><ClipboardList className="w-5 h-5" /></div>
          Machine Status Overview
        </CardTitle>
        <p className="text-white/70 text-[14px] leading-[20px] mt-1">Live status table for machines and operators</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto hide-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-[#4F4F59]">
                <TableHead className="text-white/70 font-medium">ID</TableHead>
                <TableHead className="text-white/70 font-medium">Machine</TableHead>
                <TableHead className="text-white/70 font-medium">Operator</TableHead>
                <TableHead className="text-white/70 font-medium">Shift</TableHead>
                <TableHead className="text-white/70 font-medium">Status</TableHead>
                <TableHead className="text-white/70 font-medium">Efficiency</TableHead>
                <TableHead className="text-white/70 font-medium">Output</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index} className="border-[#4F4F59]">
                  <TableCell className="text-white">{row.id}</TableCell>
                  <TableCell className="text-white">{row.machine}</TableCell>
                  <TableCell className="text-white">{row.operator}</TableCell>
                  <TableCell className="text-white">{row.shift}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border border-[#4F4F59] bg-[#151518] text-white`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-white">{row.efficiency}</TableCell>
                  <TableCell className="text-white">{row.output}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};