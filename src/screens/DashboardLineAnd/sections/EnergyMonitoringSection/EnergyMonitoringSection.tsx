// Energy monitoring section with accent styling
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Zap, BarChart3, DollarSign, Target } from "lucide-react";
import { useEffect, useState } from 'react';
import { getMachinePerformance, MachinePerformanceDataset } from '../../../../lib/realtime';

export const EnergyMonitoringSection = (): JSX.Element => {
  const [perf, setPerf] = useState<MachinePerformanceDataset | null>(null);
  useEffect(() => { getMachinePerformance().then(setPerf); }, []);

  const allMachines = perf?.lines.flatMap(l => l.machines) || [];
  const totalEnergy = allMachines.reduce((s,m)=> s + m.energyKWh, 0);
  const avgEfficiency = allMachines.length ? allMachines.reduce((s,m)=> s + m.efficiency,0)/allMachines.length : 0;
  const peakMachine = allMachines.reduce((top,m)=> m.energyKWh > (top?.energyKWh || 0) ? m : top, undefined as any);
  const peakDemand = peakMachine ? peakMachine.energyKWh : 0;
  const energyMetrics = [
    { title: 'Total Consumption', value: totalEnergy ? totalEnergy.toLocaleString() + ' kWh' : '—', change: '+5.2%', changeType: 'increase', icon: <Zap className="w-5 h-5" /> },
    { title: 'Peak Demand', value: peakDemand ? peakDemand + ' kWh' : '—', change: '-2.1%', changeType: 'decrease', icon: <BarChart3 className="w-5 h-5" /> },
    { title: 'Energy Cost', value: totalEnergy ? ('$' + (totalEnergy * 0.5).toFixed(0)) : '—', change: '+3.8%', changeType: 'increase', icon: <DollarSign className="w-5 h-5" /> },
    { title: 'Efficiency', value: avgEfficiency ? avgEfficiency.toFixed(1) + '%' : '—', change: '+1.2%', changeType: 'increase', icon: <Target className="w-5 h-5" /> },
  ];

  const machineEnergyData = allMachines.map(m => ({
    machine: m.name,
    consumption: m.energyKWh,
    efficiency: m.efficiency,
    status: m.efficiency >= 90 ? 'Optimal' : m.efficiency >= 85 ? 'Good' : m.efficiency >= 80 ? 'Fair' : 'Poor'
  }));

  const hourlyConsumption = perf?.hourly.map(h => ({ hour: h.hour, consumption: h.energy })) || [];

  const maxConsumption = Math.max(...hourlyConsumption.map(h => h.consumption));

  // Convert value -> height class (increments of 10%) to avoid inline style
  const heightClassFor = (value: number) => {
    const pct = Math.round((value / maxConsumption) * 100);
    if (pct >= 100) return "h-full";
    if (pct >= 90) return "h-[90%]";
    if (pct >= 80) return "h-[80%]";
    if (pct >= 70) return "h-[70%]";
    if (pct >= 60) return "h-[60%]";
    if (pct >= 50) return "h-[50%]";
    if (pct >= 40) return "h-[40%]";
    if (pct >= 30) return "h-[30%]";
    if (pct >= 20) return "h-[20%]";
    if (pct > 0) return "h-[10%]";
    return "h-0";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Optimal": return "text-green-400";
      case "Good": return "text-blue-400";
      case "Fair": return "text-yellow-400";
      case "Poor": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  // Deterministic width class (steps of 5%) to avoid inline styles & dynamic arbitrary values
  const widthClassFor = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct / 5) * 5));
    switch (clamped) {
      case 0: return "w-0";
      case 5: return "w-[5%]";
      case 10: return "w-[10%]";
      case 15: return "w-[15%]";
      case 20: return "w-[20%]";
      case 25: return "w-[25%]";
      case 30: return "w-[30%]";
      case 35: return "w-[35%]";
      case 40: return "w-[40%]";
      case 45: return "w-[45%]";
      case 50: return "w-[50%]";
      case 55: return "w-[55%]";
      case 60: return "w-[60%]";
      case 65: return "w-[65%]";
      case 70: return "w-[70%]";
      case 75: return "w-[75%]";
      case 80: return "w-[80%]";
      case 85: return "w-[85%]";
      case 90: return "w-[90%]";
      case 95: return "w-[95%]";
      case 100: return "w-full";
      default: return "w-0";
    }
  };

  return (
    <div className="space-y-6">
      {/* Energy Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {energyMetrics.map((metric, index) => {
          const accentClass = index === 0
            ? "accent-card accent-indigo"
            : index === 1
              ? "accent-card accent-teal"
              : index === 2
                ? "accent-card accent-orange"
                : "accent-card accent-green";
          const changeColor = metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400';
          return (
          <Card key={index} className={accentClass + " backdrop-blur-sm"}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">{metric.icon}</span>
                <span className={`text-sm font-medium ${changeColor}`}>
                  {metric.change}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-white/70 text-sm font-medium">{metric.title}</h3>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </div>
            </CardContent>
          </Card>
        );})}
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
                    className={"w-full bg-white/70 rounded-t-sm transition-all duration-300 hover:bg-white relative group " + heightClassFor(item.consumption)}
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
              className={"h-2 rounded-full transition-all duration-300 bg-white " + widthClassFor(machine.efficiency)}
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
                          className={"bg-white h-2 rounded-full transition-all duration-300 " + widthClassFor(item.percentage)}
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