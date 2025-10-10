import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";

export const DowntimeStopSection = (): JSX.Element => {
  const downtimeEvents = [
    {
      machine: "Machine A1",
      startTime: "2024-12-08 09:15:00",
      endTime: "2024-12-08 11:45:00",
      duration: "2h 30m",
      reason: "Planned Maintenance",
      category: "Planned",
      operator: "John Doe",
      impact: "High",
    },
    {
      machine: "Machine B2",
      startTime: "2024-12-08 14:20:00", 
      endTime: "2024-12-08 15:05:00",
      duration: "45m",
      reason: "Tool Change",
      category: "Planned",
      operator: "Jane Smith",
      impact: "Medium",
    },
    {
      machine: "Machine C3",
      startTime: "2024-12-08 16:30:00",
      endTime: "Ongoing",
      duration: "1h 15m",
      reason: "Motor Failure",
      category: "Unplanned",
      operator: "Mike Johnson",
      impact: "Critical",
    },
  ];

  const getCategoryColor = (category: string) => {
    return category === "Planned" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical": return "bg-red-500/20 text-red-400";
      case "High": return "bg-orange-500/20 text-orange-400";
      case "Medium": return "bg-yellow-500/20 text-yellow-400";
      case "Low": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">3</div>
            <div className="text-white/70 text-sm">Active Downtimes</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">4h 30m</div>
            <div className="text-white/70 text-sm">Total Today</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">2</div>
            <div className="text-white/70 text-sm">Planned</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">1</div>
            <div className="text-white/70 text-sm">Unplanned</div>
          </CardContent>
        </Card>
      </div>

      {/* Downtime Events Table */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">Downtime & Stop Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto hide-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-white/70">Machine</TableHead>
                  <TableHead className="text-white/70">Start Time</TableHead>
                  <TableHead className="text-white/70">End Time</TableHead>
                  <TableHead className="text-white/70">Duration</TableHead>
                  <TableHead className="text-white/70">Reason</TableHead>
                  <TableHead className="text-white/70">Category</TableHead>
                  <TableHead className="text-white/70">Impact</TableHead>
                  <TableHead className="text-white/70">Operator</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downtimeEvents.map((event, index) => (
                  <TableRow key={index} className="border-white/20">
                    <TableCell className="text-white font-medium">{event.machine}</TableCell>
                    <TableCell className="text-white">{event.startTime}</TableCell>
                    <TableCell className="text-white">{event.endTime}</TableCell>
                    <TableCell className="text-white font-medium">{event.duration}</TableCell>
                    <TableCell className="text-white">{event.reason}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getImpactColor(event.impact)}>
                        {event.impact}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{event.operator}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Downtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Top Downtime Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { reason: "Planned Maintenance", percentage: 45, color: "bg-blue-500" },
                { reason: "Tool Changes", percentage: 25, color: "bg-yellow-500" },
                { reason: "Equipment Failure", percentage: 20, color: "bg-red-500" },
                { reason: "Material Shortage", percentage: 10, color: "bg-purple-500" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span>{item.reason}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Machine Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { machine: "Machine A1", availability: 92, status: "Good" },
                { machine: "Machine B2", availability: 88, status: "Fair" },
                { machine: "Machine C3", availability: 75, status: "Poor" },
                { machine: "Machine D4", availability: 95, status: "Excellent" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-white">{item.machine}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.availability >= 90 ? 'bg-green-500' :
                          item.availability >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.availability}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-12">{item.availability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};