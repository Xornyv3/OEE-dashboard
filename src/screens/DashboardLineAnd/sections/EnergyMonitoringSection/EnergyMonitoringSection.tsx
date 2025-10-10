import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Zap, BarChart3, DollarSign, Target } from "lucide-react";

export const EnergyMonitoringSection = (): JSX.Element => {
  const energyMetrics = [
    {
      title: "Total Consumption",
      value: "2,450 kWh",
      change: "+5.2%",
      changeType: "increase",
  icon: <Zap className="w-5 h-5" />,
    },
    {
      title: "Peak Demand",
      value: "185 kW",
      change: "-2.1%",
      changeType: "decrease", 
  icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Energy Cost",
      value: "$1,225",
      change: "+3.8%",
      changeType: "increase",
  icon: <DollarSign className="w-5 h-5" />,
    },
    {
      title: "Efficiency",
      value: "87.5%",
      change: "+1.2%",
      changeType: "increase",
  icon: <Target className="w-5 h-5" />,
    },
  ];

  const machineEnergyData = [
    { machine: "Machine A1", consumption: 450, efficiency: 92, status: "Optimal" },
    { machine: "Machine B2", consumption: 380, efficiency: 88, status: "Good" },
    { machine: "Machine C3", consumption: 520, efficiency: 85, status: "Fair" },
    { machine: "Machine D4", consumption: 420, efficiency: 90, status: "Good" },
    { machine: "Machine E5", consumption: 680, efficiency: 78, status: "Poor" },
  ];

  const hourlyConsumption = [
    { hour: "00:00", consumption: 120 },
    { hour: "04:00", consumption: 95 },
    { hour: "08:00", consumption: 180 },
    { hour: "12:00", consumption: 165 },
    { hour: "16:00", consumption: 195 },
    { hour: "20:00", consumption: 140 },
  ];

  const maxConsumption = Math.max(...hourlyConsumption.map(h => h.consumption));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Optimal": return "text-green-400";
      case "Good": return "text-blue-400";
      case "Fair": return "text-yellow-400";
      case "Poor": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Energy Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {energyMetrics.map((metric, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">{metric.icon}</span>
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-white/70 text-sm font-medium">{metric.title}</h3>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Energy Consumption Chart */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">24-Hour Energy Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 h-48">
              {hourlyConsumption.map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-end">
                  <div 
                    className="w-full bg-white/70 rounded-t-sm transition-all duration-300 hover:bg-white relative group"
                    style={{ height: `${(item.consumption / maxConsumption) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.consumption} kW
                    </div>
                  </div>
                  <div className="text-white/70 text-xs mt-2">{item.hour}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machine Energy Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Machine Energy Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machineEnergyData.map((machine, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{machine.machine}</span>
                    <span className={`text-sm font-medium ${getStatusColor(machine.status)}`}>
                      {machine.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">Consumption: </span>
                      <span className="text-white font-medium">{machine.consumption} kWh</span>
                    </div>
                    <div>
                      <span className="text-white/70">Efficiency: </span>
                      <span className="text-white font-medium">{machine.efficiency}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                          className={`h-2 rounded-full transition-all duration-300 bg-white`}
                        style={{ width: `${machine.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Energy Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-3">Peak Hours Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Morning Peak (8-12)</span>
                    <span className="text-white font-medium">180 kW avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Afternoon Peak (12-18)</span>
                    <span className="text-white font-medium">195 kW avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Night Low (22-06)</span>
                    <span className="text-white font-medium">110 kW avg</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Cost Breakdown</h4>
                <div className="space-y-3">
                  {[
                    { category: "Base Load", cost: "$450", percentage: 37 },
                    { category: "Peak Demand", cost: "$520", percentage: 42 },
                    { category: "Off-Peak", cost: "$255", percentage: 21 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-white">
                        <span>{item.category}</span>
                        <span>{item.cost}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> Energy Saving Tip</h4>
                <p className="text-white/70 text-sm">
                  Machine E5 shows 78% efficiency. Consider scheduling maintenance to improve energy performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};