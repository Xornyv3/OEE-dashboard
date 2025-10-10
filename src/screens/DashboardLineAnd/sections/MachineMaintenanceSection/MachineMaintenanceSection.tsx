// React import not required in TSX with modern tooling
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

export const MachineMaintenanceSection = (): JSX.Element => {
  const maintenanceSchedule = [
    {
      machine: "Machine A1",
      type: "Preventive",
      description: "Oil change and filter replacement",
      dueDate: "2024-12-10",
      priority: "High",
      estimatedDuration: "4h",
      assignedTechnician: "John Smith",
      status: "Scheduled",
    },
    {
      machine: "Machine B2",
      type: "Corrective", 
      description: "Motor bearing replacement",
      dueDate: "2024-12-09",
      priority: "Critical",
      estimatedDuration: "6h",
      assignedTechnician: "Mike Johnson",
      status: "In Progress",
    },
    {
      machine: "Machine C3",
      type: "Preventive",
      description: "Calibration and alignment check",
      dueDate: "2024-12-12",
      priority: "Medium",
      estimatedDuration: "2h",
      assignedTechnician: "Sarah Davis",
      status: "Scheduled",
    },
  ];

  const maintenanceHistory = [
    {
      date: "2024-12-05",
      machine: "Machine A1",
      type: "Preventive",
      description: "Monthly inspection",
      duration: "2h 30m",
      cost: "$450",
      technician: "John Smith",
    },
    {
      date: "2024-12-03",
      machine: "Machine D4",
      type: "Corrective",
      description: "Hydraulic pump repair",
      duration: "5h 15m", 
      cost: "$1,200",
      technician: "Mike Johnson",
    },
  ];

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "danger";
      case "High":
        return "warning";
      case "Medium":
        return "info";
      case "Low":
        return "success";
      default:
        return "subtle";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "info";
      case "Scheduled":
        return "warning";
      case "Overdue":
        return "danger";
      default:
        return "subtle";
    }
  };

  // Map a few known percentages to width classes to avoid inline styles
  const widthClassFor = (pct: number) => {
    switch (pct) {
      case 65:
        return "w-[65%]";
      case 25:
        return "w-[25%]";
      case 10:
        return "w-[10%]";
      default:
        if (pct >= 100) return "w-full";
        if (pct >= 90) return "w-[90%]";
        if (pct >= 80) return "w-[80%]";
        if (pct >= 70) return "w-[70%]";
        if (pct >= 60) return "w-[60%]";
        if (pct >= 50) return "w-[50%]";
        if (pct >= 40) return "w-[40%]";
        if (pct >= 30) return "w-[30%]";
        if (pct >= 20) return "w-[20%]";
        if (pct > 0) return "w-[10%]";
        return "w-0";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-white/70 text-sm">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-white/70 text-sm">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-white/70 text-sm">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">15</div>
            <div className="text-white/70 text-sm">Completed This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-xl">Maintenance Schedule</CardTitle>
            <Button>
              Schedule Maintenance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto hide-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="border-[#4F4F59]">
                  <TableHead className="text-white/70">Machine</TableHead>
                  <TableHead className="text-white/70">Type</TableHead>
                  <TableHead className="text-white/70">Description</TableHead>
                  <TableHead className="text-white/70">Due Date</TableHead>
                  <TableHead className="text-white/70">Priority</TableHead>
                  <TableHead className="text-white/70">Duration</TableHead>
                  <TableHead className="text-white/70">Technician</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceSchedule.map((item, index) => (
                  <TableRow key={index} className="border-[#4F4F59]">
                    <TableCell className="text-white font-medium">{item.machine}</TableCell>
                    <TableCell className="text-white">{item.type}</TableCell>
                    <TableCell className="text-white">{item.description}</TableCell>
                    <TableCell className="text-white">{item.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(item.priority)}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{item.estimatedDuration}</TableCell>
                    <TableCell className="text-white">{item.assignedTechnician}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance History and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-xl">Recent Maintenance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceHistory.map((item, index) => (
                <div key={index} className="p-4 bg-[#191921] rounded-[6px] border border-[#4F4F59]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-white font-medium">{item.machine}</div>
                      <div className="text-white/70 text-sm">{item.description}</div>
                    </div>
                    <Badge variant={item.type === 'Preventive' ? 'info' : 'danger'}>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">Date: </span>
                      <span className="text-white">{item.date}</span>
                    </div>
                    <div>
                      <span className="text-white/70">Duration: </span>
                      <span className="text-white">{item.duration}</span>
                    </div>
                    <div>
                      <span className="text-white/70">Cost: </span>
                      <span className="text-white">{item.cost}</span>
                    </div>
                    <div>
                      <span className="text-white/70">Technician: </span>
                      <span className="text-white">{item.technician}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white text-xl">Maintenance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-3">Maintenance Types Distribution</h4>
                <div className="space-y-3">
                  {[
                    { type: "Preventive", percentage: 65 },
                    { type: "Corrective", percentage: 25 },
                    { type: "Predictive", percentage: 10 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-white">
                        <span>{item.type}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#4F4F59] rounded-full h-2">
                        <div className={`bg-white h-2 rounded-full ${widthClassFor(item.percentage)}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Monthly Maintenance Cost</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">$12,450</div>
                  <div className="text-white/70 text-sm">This Month</div>
                  <div className="text-white/70 text-sm mt-1">-8.5% vs last month</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};