import { Button } from "../../../../components/ui/button";
import { Settings, Activity, RotateCcw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

export const MachineStatusSection = (): JSX.Element => {
  const lineGroups = ["Line 1", "Line 2", "Line 3"];
  const machineGroups = ["Machining", "Assembly", "Quality Control"];

  return (
    <Card className="rounded-[6px] overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          Machine Group Selection
        </CardTitle>
  <p className="text-white/70 text-[14px] leading-[20px] mt-1">Configure your production line setup</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Line Group Dropdown */}
          <div className="space-y-3">
            <label className="text-white/70 text-sm font-medium">Production Line</label>
            <Select>
              <SelectTrigger className="h-11 rounded-[6px] border border-[#4F4F59] bg-[#151518] text-white">
                <SelectValue placeholder="Select Line Group" />
              </SelectTrigger>
              <SelectContent className="bg-[#151518] border border-[#4F4F59] text-white">
                {lineGroups.map((group, index) => (
                  <SelectItem
                    key={`line-${index}`}
                    value={group.toLowerCase().replace(/\s+/g, "-")}
                    className="text-white data-[highlighted]:bg-[#191921]"
                  >
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Machine Group Dropdown */}
          <div className="space-y-3">
            <label className="text-white/70 text-sm font-medium">Machine Type</label>
            <Select>
              <SelectTrigger className="h-11 rounded-[6px] border border-[#4F4F59] bg-[#151518] text-white">
                <SelectValue placeholder="Select Machine Group" />
              </SelectTrigger>
              <SelectContent className="bg-[#151518] border border-[#4F4F59] text-white">
                {machineGroups.map((group, index) => (
                  <SelectItem
                    key={`machine-${index}`}
                    value={group.toLowerCase().replace(/\s+/g, "-")}
                    className="text-white data-[highlighted]:bg-[#191921]"
                  >
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Show Current OEE Button */}
          <Button variant="outline" className="h-11 font-semibold">
            <Activity className="w-4 h-4 mr-2" />
            Current OEE
          </Button>

          {/* Reset Machine Group Button */}
          <Button variant="ghost" className="h-11 font-semibold">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Selection
          </Button>
        </div>

        {/* Historical Data Button */}
        <Button
          variant="outline"
          className="w-full h-11 font-medium"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Historical Data
        </Button>
      </CardContent>
    </Card>
  );
};