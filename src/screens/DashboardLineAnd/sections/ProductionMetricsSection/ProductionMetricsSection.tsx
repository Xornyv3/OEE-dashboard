import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { BarChart3, Square, Building2 } from "lucide-react";

export const ProductionMetricsSection = (): JSX.Element => {
  const machineInfo = [
    { label: "Production Date", value: "2024-12-08" },
    { label: "Line Group", value: "Line 1" },
    { label: "Machine Group", value: "Machining" },
    { label: "Machine Name", value: "XYZ" },
    { label: "Total Machines", value: "2" },
  ];

  const legendItems: { label: string; colorClass: string }[] = [
    { label: "Availability", colorClass: "text-[#05C168]" }, // green
    { label: "Performance", colorClass: "text-[#FF9E2C]" }, // orange
    { label: "Quality", colorClass: "text-[#FACC15]" }, // yellow
    { label: "Others", colorClass: "text-[#FF5A65]" }, // red
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* OEE Card */}
        <Card className="rounded-[6px] overflow-hidden">
        <CardHeader>
            <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            Overall Equipment Effectiveness
          </CardTitle>
          <p className="text-white/70 text-[14px] leading-[20px] mt-1">Real-time performance metrics</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            {/* OEE Percentage Display with colored quarters (A/P/Q/Other) */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-8 border-[#4F4F59]"></div>
              
              {/* Progress circles */}
              {/* Availability (top, green) */}
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#05C168] clip-quarter-top"></div>
              {/* Performance (right, orange) */}
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-r-[#FF9E2C] clip-quarter-right"></div>
              {/* Quality (bottom, yellow) */}
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-[#FACC15] clip-quarter-bottom"></div>
              
              {/* Center content */}
              <div className="relative z-10 text-center">
                <span className="text-5xl text-white font-bold">75%</span>
                <div className="text-white/70 text-sm font-medium mt-2">OEE Score</div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {legendItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[6px] border border-[#4F4F59] bg-[#191921] text-white px-3 py-2 flex items-center gap-3"
                >
                    <Square className={`w-3.5 h-3.5 ${item.colorClass}`} />
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machine Information Card */}
      <Card className="rounded-[6px] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            Production Details
          </CardTitle>
          <p className="text-white/70 text-[14px] leading-[20px] mt-1">Current machine configuration</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {machineInfo.map((info, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
                <span className="text-white/70 text-sm font-medium">
                  {info.label}:
                </span>
                <span className="text-white text-sm font-semibold">
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};