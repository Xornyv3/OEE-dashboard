import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TrendingUp, CheckCircle2, Trash2, Repeat, AlertTriangle } from "lucide-react";

export const DailyProductionOverviewSection = (): JSX.Element => {
  const productionMetrics = [
    {
      title: "Good Parts",
      subtitle: "Defect-free units produced",
      value: "300",
      bgColor: "bg-[#191921]",
      textColor: "text-white",
    },
    {
      title: "Scrap Count",
      subtitle: "Units scrapped",
      value: "25",
      bgColor: "bg-[#191921]",
      textColor: "text-white",
    },
    {
      title: "Rework Count",
      subtitle: "Units requiring rework",
      value: "15",
      bgColor: "bg-[#191921]",
      textColor: "text-white",
    },
    {
      title: "Defect Count",
      subtitle: "Defective units produced",
      value: "10",
      bgColor: "bg-[#191921]",
      textColor: "text-white",
    },
  ];

  const machineInfoItems = [
    { label: "Working Hours", value: "21/day" },
    { label: "Products Planned", value: "200" },
    { label: "Products Left", value: "20" },
    { label: "Efficiency", value: "85%" },
  ];

  return (
    <Card className="rounded-[6px] overflow-hidden">
      <CardHeader>
  <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
    <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
          Daily Production Overview
        </CardTitle>
  <p className="text-white/70 text-[14px] leading-[20px] mt-1">Today's manufacturing performance summary</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Machine Information */}
          <div className="space-y-5">
            <h3 className="text-white text-[18px] leading-[24px] font-bold mb-4 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              Live Status
            </h3>
            <div className="space-y-4">
              {machineInfoItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
                  <span className="text-white/70 text-sm font-medium">
                    {item.label}:
                  </span>
                  <span className="text-white text-sm font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Production Metrics Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {productionMetrics.map((metric, index) => (
                <Card
                  key={index}
                  className="rounded-[6px] overflow-hidden border border-[#4F4F59] bg-[#191921]"
                >
                  <CardContent className="p-6 text-center relative">
                    {/* Background tint based on metric type */}
                    <div className={`absolute inset-0 ${metric.bgColor} opacity-10`}></div>
                    
                    <div className="relative z-10 text-white space-y-4">
                      <div className="w-12 h-12 mx-auto rounded-[6px] border border-[#4F4F59] bg-[#191921] flex items-center justify-center mb-4">
                        {metric.title.includes('Good') && <CheckCircle2 className="w-6 h-6" />}
                        {metric.title.includes('Scrap') && <Trash2 className="w-6 h-6" />}
                        {metric.title.includes('Rework') && <Repeat className="w-6 h-6" />}
                        {metric.title.includes('Defect') && <AlertTriangle className="w-6 h-6" />}
                      </div>
                      
                      <h4 className="font-semibold text-sm text-white">
                        {metric.title}
                      </h4>
                      <p className="text-xs text-white/70">
                        {metric.subtitle}
                      </p>
                      <div className="text-3xl font-bold text-white">
                        {metric.value}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};