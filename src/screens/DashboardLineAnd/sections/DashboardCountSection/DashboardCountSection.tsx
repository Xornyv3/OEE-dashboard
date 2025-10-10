import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

export const DashboardCountSection = (): JSX.Element => {
  const productionCounts = [
    {
      title: "Total Production",
      count: "12,450",
      change: "+5.2%",
      changeType: "increase",
      period: "vs yesterday",
    },
    {
      title: "Good Parts",
      count: "11,890",
      change: "+3.8%", 
      changeType: "increase",
      period: "vs yesterday",
    },
    {
      title: "Defective Parts",
      count: "560",
      change: "-12.5%",
      changeType: "decrease",
      period: "vs yesterday",
    },
    {
      title: "Scrap Count",
      count: "125",
      change: "+8.3%",
      changeType: "increase",
      period: "vs yesterday",
    },
  ];

  const hourlyProduction = [
    { hour: "06:00", count: 520 },
    { hour: "07:00", count: 580 },
    { hour: "08:00", count: 620 },
    { hour: "09:00", count: 590 },
    { hour: "10:00", count: 650 },
    { hour: "11:00", count: 680 },
    { hour: "12:00", count: 420 },
    { hour: "13:00", count: 610 },
    { hour: "14:00", count: 640 },
    { hour: "15:00", count: 670 },
    { hour: "16:00", count: 580 },
    { hour: "17:00", count: 520 },
  ];

  const maxCount = Math.max(...hourlyProduction.map(h => h.count));

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
        {productionCounts.map((item, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
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
        ))}
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
              {[
                { line: "Line 1", count: 3250, target: 3500, efficiency: 93 },
                { line: "Line 2", count: 2890, target: 3000, efficiency: 96 },
                { line: "Line 3", count: 3150, target: 3200, efficiency: 98 },
                { line: "Line 4", count: 2760, target: 3100, efficiency: 89 },
                { line: "Line 5", count: 3400, target: 3400, efficiency: 100 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.line}</span>
                    <div className="text-right">
                      <div className="text-white">{item.count} / {item.target}</div>
                      <div className={"text-sm text-white/80"}>
                        {item.efficiency}% efficiency
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-white ${widthClassFor(item.count, item.target)}`}></div>
                  </div>
                </div>
              ))}
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
                <div className="text-4xl font-bold text-white">95.5%</div>
                <div className="text-white/70">Overall Quality Rate</div>
              </div>
              <div className="space-y-4">
                {[
                  { metric: "First Pass Yield", value: "94.2%", color: "bg-white" },
                  { metric: "Rework Rate", value: "3.8%", color: "bg-white/70" },
                  { metric: "Scrap Rate", value: "2.0%", color: "bg-white/40" },
                ].map((item, index) => (
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