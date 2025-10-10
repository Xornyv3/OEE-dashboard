import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";

export const OEEDataInputSection = (): JSX.Element => {
  const [formData, setFormData] = useState({
    machine: "",
    shift: "",
    plannedProductionTime: "",
    actualProductionTime: "",
    idealCycleTime: "",
    totalParts: "",
    goodParts: "",
    defectiveParts: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateOEE = () => {
    const availability = (parseFloat(formData.actualProductionTime) / parseFloat(formData.plannedProductionTime)) * 100;
    const performance = (parseFloat(formData.idealCycleTime) * parseFloat(formData.totalParts)) / (parseFloat(formData.actualProductionTime) * 60) * 100;
    const quality = (parseFloat(formData.goodParts) / parseFloat(formData.totalParts)) * 100;
    const oee = (availability * performance * quality) / 10000;
    
    return {
      availability: availability.toFixed(1),
      performance: performance.toFixed(1),
      quality: quality.toFixed(1),
      oee: oee.toFixed(1)
    };
  };

  const recentEntries = [
    {
      date: "2024-12-08",
      machine: "Machine A1",
      shift: "Morning",
      oee: 85.2,
      availability: 92.1,
      performance: 89.5,
      quality: 96.8,
    },
    {
      date: "2024-12-08",
      machine: "Machine B2", 
      shift: "Afternoon",
      oee: 78.5,
      availability: 88.3,
      performance: 85.2,
      quality: 95.1,
    },
    {
      date: "2024-12-07",
      machine: "Machine C3",
      shift: "Night",
      oee: 91.3,
      availability: 95.8,
      performance: 93.2,
      quality: 97.5,
    },
  ];

  const isFormValid = Object.values(formData).every(value => value !== "");
  const calculatedOEE = isFormValid ? calculateOEE() : null;

  return (
    <div className="space-y-6">
      {/* Data Input Form */}
      <Card className="glass-card-strong rounded-2xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl font-objectivity">OEE Data Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Machine and Shift Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Machine</label>
                <Select value={formData.machine} onValueChange={(value) => handleInputChange("machine", value)}>
                  <SelectTrigger className="h-10 rounded-xl border border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-[#6C63FF]/20">
                    <SelectValue placeholder="Select Machine" />
                  </SelectTrigger>
                  <SelectContent className="glass-card-strong border-white/20">
                    <SelectItem value="machine-a1" className="text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10">Machine A1</SelectItem>
                    <SelectItem value="machine-b2" className="text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10">Machine B2</SelectItem>
                    <SelectItem value="machine-c3" className="text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10">Machine C3</SelectItem>
                    <SelectItem value="machine-d4" className="text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10">Machine D4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Shift</label>
                <Select value={formData.shift} onValueChange={(value) => handleInputChange("shift", value)}>
                  <SelectTrigger className="h-10 rounded-xl border border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-[#6C63FF]/20">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent className="glass-card-strong border-white/20">
                    <SelectItem value="morning" className="text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10">Morning (6:00 - 14:00)</SelectItem>
                    <SelectItem value="afternoon" className="text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10">Afternoon (14:00 - 22:00)</SelectItem>
                    <SelectItem value="night" className="text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10">Night (22:00 - 6:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Planned Production Time (minutes)</label>
                <Input
                  type="number"
                  value={formData.plannedProductionTime}
                  onChange={(e) => handleInputChange("plannedProductionTime", e.target.value)}
                  className="bg-transparent border-white/20 text-white"
                  placeholder="480"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Actual Production Time (minutes)</label>
                <Input
                  type="number"
                  value={formData.actualProductionTime}
                  onChange={(e) => handleInputChange("actualProductionTime", e.target.value)}
                  className="bg-transparent border-white/20 text-white"
                  placeholder="450"
                />
              </div>
            </div>

            {/* Production Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Ideal Cycle Time (seconds)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.idealCycleTime}
                  onChange={(e) => handleInputChange("idealCycleTime", e.target.value)}
                  className="bg-transparent border-white/20 text-white"
                  placeholder="30.5"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Total Parts Produced</label>
                <Input
                  type="number"
                  value={formData.totalParts}
                  onChange={(e) => handleInputChange("totalParts", e.target.value)}
                  className="bg-transparent border-white/20 text-white"
                  placeholder="850"
                />
              </div>
            </div>

            {/* Quality Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Good Parts</label>
                <Input
                  type="number"
                  value={formData.goodParts}
                  onChange={(e) => handleInputChange("goodParts", e.target.value)}
                  className="bg-transparent border-white/20 text-white"
                  placeholder="820"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Defective Parts</label>
                <Input
                  type="number"
                  value={formData.defectiveParts}
                  onChange={(e) => handleInputChange("defectiveParts", e.target.value)}
                  className="bg-transparent border-white/20 text-white"
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          {/* Calculated OEE Display */}
          {calculatedOEE && (
            <div className="mt-6 p-4 rounded-lg border border-[#6C63FF]/20 bg-[#6C63FF]/10">
              <h4 className="text-white font-medium mb-3">Calculated OEE Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8A6EFF]">{calculatedOEE.availability}%</div>
                  <div className="text-white/70 text-sm">Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6C63FF]">{calculatedOEE.performance}%</div>
                  <div className="text-white/70 text-sm">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4F83FF]">{calculatedOEE.quality}%</div>
                  <div className="text-white/70 text-sm">Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{calculatedOEE.oee}%</div>
                  <div className="text-white/70 text-sm">Overall OEE</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button disabled={!isFormValid}>
              Save Data
            </Button>
            <Button 
              variant="outline"
              onClick={() => setFormData({
                machine: "",
                shift: "",
                plannedProductionTime: "",
                actualProductionTime: "",
                idealCycleTime: "",
                totalParts: "",
                goodParts: "",
                defectiveParts: "",
              })}
            >
              Clear Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="glass-card-strong rounded-2xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl font-objectivity">Recent OEE Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white/70 p-3">Date</th>
                  <th className="text-left text-white/70 p-3">Machine</th>
                  <th className="text-left text-white/70 p-3">Shift</th>
                  <th className="text-left text-white/70 p-3">OEE (%)</th>
                  <th className="text-left text-white/70 p-3">Availability (%)</th>
                  <th className="text-left text-white/70 p-3">Performance (%)</th>
                  <th className="text-left text-white/70 p-3">Quality (%)</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="text-white p-3">{entry.date}</td>
                    <td className="text-white font-medium p-3">{entry.machine}</td>
                    <td className="text-white p-3">{entry.shift}</td>
                    <td className="text-white font-bold p-3">{entry.oee.toFixed(1)}%</td>
                    <td className="text-white p-3">{entry.availability.toFixed(1)}%</td>
                    <td className="text-white p-3">{entry.performance.toFixed(1)}%</td>
                    <td className="text-white p-3">{entry.quality.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};