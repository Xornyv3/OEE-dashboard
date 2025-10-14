import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { useEffect, useState } from 'react';
import { getMachinePerformance, MachinePerformanceDataset } from '../../../../lib/realtime';

export const DashboardCountSection = (): JSX.Element => {
  const [data, setData] = useState<MachinePerformanceDataset | null>(null);
  useEffect(() => { getMachinePerformance().then(setData); }, []);

  const allMachines = data?.lines.flatMap(l => l.machines) || [];
  const totals = allMachines.reduce((acc, m) => {
    acc.good += m.good;
    acc.scrap += m.scrap;
    acc.rework += m.rework;
    return acc;
  }, { good: 0, scrap: 0, rework: 0 });
  const totalProduction = totals.good + totals.scrap;

  const productionCounts = [
    { title: 'Total Production', count: totalProduction.toLocaleString(), change: '+5.2%', changeType: 'increase', period: 'vs yesterday' },
    { title: 'Good Parts', count: totals.good.toLocaleString(), change: '+3.8%', changeType: 'increase', period: 'vs yesterday' },
    { title: 'Defective Parts', count: totals.scrap.toLocaleString(), change: '-1.2%', changeType: 'decrease', period: 'vs yesterday' },
    { title: 'Rework', count: totals.rework.toLocaleString(), change: '+0.5%', changeType: 'increase', period: 'vs yesterday' },
  ];

  const hourlyProduction = data?.hourly.map(h => ({ hour: h.hour, count: h.count })) || [];

  const maxCount = hourlyProduction.length ? Math.max(...hourlyProduction.map(h => h.count)) : 0;

  const barHeightFor = (value: number) => {
    const pct = Math.round((value / maxCount) * 100);
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

  const widthClassFor = (count: number, target: number) => {
    const pct = Math.round((count / target) * 100);
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
  };

  return (
    <div className="space-y-6">
      {/* Production Count Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productionCounts.map((item, index) => {
          const accentClass = index === 0
            ? "accent-card accent-indigo"
            : index === 1
              ? "accent-card accent-green"
              : index === 2
                ? "accent-card accent-red"
                : "accent-card accent-orange";
          return (
          <Card key={index} className={accentClass + " backdrop-blur-sm"}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-white/70 text-sm font-medium">{item.title}</h3>
                <div className="text-3xl font-bold text-white">{item.count}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    item.changeType === 'increase' ? 'text-white' : 'text-white/70'
                  }`}>
                    {item.change}
                  </span>
                  <span className="text-white/50 text-sm">{item.period}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );})}
      </div>

      {/* Hourly Production Chart */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">Hourly Production Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 h-64">
              {hourlyProduction.map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-end">
                  <div className={`w-full bg-white rounded-t-sm ${barHeightFor(item.count)}`}></div>
                  <div className="text-white/70 text-xs mt-2 transform -rotate-45 origin-center">
                    {item.hour}
                  </div>
                  <div className="text-white text-xs font-medium mt-1">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Production by Line</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.lines.map((ln, index) => {
                const lineGood = ln.machines.reduce((s,m) => s + m.good, 0);
                const lineScrap = ln.machines.reduce((s,m) => s + m.scrap, 0);
                const lineTotal = lineGood + lineScrap;
                const efficiency = Math.round(
                  ln.machines.reduce((s,m)=> s + m.efficiency,0) / (ln.machines.length || 1)
                );
                return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{ln.lineId}</span>
                    <div className="text-right">
                      <div className="text-white">{lineTotal.toLocaleString()} / {ln.targetPerHour * 8}</div>
                      <div className={"text-sm text-white/80"}>
                        {efficiency}% efficiency
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-white ${widthClassFor(lineTotal, ln.targetPerHour * 8)}`}></div>
                  </div>
                </div>
              );})}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{
                  allMachines.length ? (
                    (allMachines.reduce((s,m)=> s + m.quality,0) / allMachines.length).toFixed(1) + '%'
                  ) : '—'
                }</div>
                <div className="text-white/70">Overall Quality Rate</div>
              </div>
              <div className="space-y-4">
                {(() => {
                  const avgQuality = allMachines.length ? allMachines.reduce((s,m)=> s + m.quality,0)/allMachines.length : 0;
                  const total = totalProduction || 1;
                  const scrapRate = total ? (totals.scrap/total)*100 : 0;
                  const reworkRate = total ? (totals.rework/total)*100 : 0;
                  const fpYield = avgQuality; // placeholder mapping
                  return [
                    { metric: 'First Pass Yield', value: fpYield.toFixed(1)+'%', color: 'bg-white' },
                    { metric: 'Rework Rate', value: reworkRate.toFixed(1)+'%', color: 'bg-white/70' },
                    { metric: 'Scrap Rate', value: scrapRate.toFixed(1)+'%', color: 'bg-white/40' },
                  ];
                })().map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/70">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};