import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Calculator, Timer } from "lucide-react";

export const MachineInfoSection = (): JSX.Element => {
  const downtimeData = [
    {
      machine: "Machine A1",
      type: "Planned",
      duration: "2h 30m",
      reason: "Maintenance",
      comment: "Scheduled maintenance",
    },
    {
      machine: "Machine B2", 
      type: "Unplanned",
      duration: "45m",
      reason: "Breakdown",
      comment: "Motor failure",
    },
    {
      machine: "Machine C3",
      type: "Planned", 
      duration: "1h 15m",
      reason: "Setup",
      comment: "Product changeover",
    },
  ];

  const oeeMetrics = {
    performance: "85%",
    quality: "92%", 
    availability: "78%",
    overall: "61%"
  };

  return (
    <div className="space-y-4">
      {/* OEE Metrics Card */}
      <Card className="rounded-[6px]">
        <CardHeader>
          <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center"><Calculator className="w-5 h-5" /></div>
            OEE Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Performance:</span>
              <span className="text-white font-medium">{oeeMetrics.performance}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Quality:</span>
              <span className="text-white font-medium">{oeeMetrics.quality}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Availability:</span>
              <span className="text-white font-medium">{oeeMetrics.availability}</span>
            </div>
            <hr className="border-[#4F4F59]" />
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Overall OEE:</span>
              <span className="text-white font-bold text-lg">{oeeMetrics.overall}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downtime Information Card */}
      <Card className="rounded-[6px]">
        <CardHeader>
          <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center"><Timer className="w-5 h-5" /></div>
            Recent Downtime Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {downtimeData.map((event, index) => (
              <div key={index} className="p-3 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-medium text-sm">{event.machine}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border border-[#4F4F59] bg-[#151518] text-white`}>
                    {event.type}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white">{event.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Reason:</span>
                    <span className="text-white">{event.reason}</span>
                  </div>
                  <div className="text-white/70 mt-2">
                    {event.comment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};