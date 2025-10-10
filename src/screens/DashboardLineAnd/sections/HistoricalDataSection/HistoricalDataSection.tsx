import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";

export const HistoricalDataSection = (): JSX.Element => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("oee");

  const historicalData = [
    { date: "2024-12-01", oee: 85.2, availability: 92.1, performance: 89.5, quality: 96.8 },
    { date: "2024-12-02", oee: 87.1, availability: 94.3, performance: 91.2, quality: 95.4 },
    { date: "2024-12-03", oee: 82.5, availability: 88.7, performance: 87.8, quality: 97.2 },
    { date: "2024-12-04", oee: 89.3, availability: 95.1, performance: 92.4, quality: 96.1 },
    { date: "2024-12-05", oee: 86.7, availability: 91.8, performance: 90.1, quality: 95.9 },
    { date: "2024-12-06", oee: 88.9, availability: 93.5, performance: 91.8, quality: 96.5 },
    { date: "2024-12-07", oee: 84.1, availability: 89.2, performance: 88.6, quality: 97.1 },
  ];

  const getMetricValue = (data: any, metric: string) => {
    switch (metric) {
      case "oee": return data.oee;
      case "availability": return data.availability;
      case "performance": return data.performance;
      case "quality": return data.quality;
      default: return data.oee;
    }
  };

  const maxValue = Math.max(...historicalData.map(d => getMetricValue(d, selectedMetric)));

  const heightClassFor = (value: number) => {
    const pct = Math.round((value / maxValue) * 100);
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

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-xl">Historical Data Analysis</CardTitle>
            <div className="flex gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 h-10 rounded-[6px] border border-[#4F4F59] bg-[#151518] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151518] border border-[#4F4F59]">
                  <SelectItem value="7days" className="text-white data-[highlighted]:bg-[#191921]">7 Days</SelectItem>
                  <SelectItem value="30days" className="text-white data-[highlighted]:bg-[#191921]">30 Days</SelectItem>
                  <SelectItem value="90days" className="text-white data-[highlighted]:bg-[#191921]">90 Days</SelectItem>
                  <SelectItem value="1year" className="text-white data-[highlighted]:bg-[#191921]">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40 h-10 rounded-[6px] border border-[#4F4F59] bg-[#151518] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151518] border border-[#4F4F59]">
                  <SelectItem value="oee" className="text-white data-[highlighted]:bg-[#191921]">Overall OEE</SelectItem>
                  <SelectItem value="availability" className="text-white data-[highlighted]:bg-[#191921]">Availability</SelectItem>
                  <SelectItem value="performance" className="text-white data-[highlighted]:bg-[#191921]">Performance</SelectItem>
                  <SelectItem value="quality" className="text-white data-[highlighted]:bg-[#191921]">Quality</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-transparent">
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Historical Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl capitalize">{selectedMetric} Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 h-64">
              {historicalData.map((item, index) => {
                const value = getMetricValue(item, selectedMetric);
                return (
                  <div key={index} className="flex flex-col items-center justify-end">
                    <div className={`w-full bg-white rounded-t-sm relative ${heightClassFor(value)}`}>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-100">
                        {value.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-white/70 text-xs mt-2">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {(historicalData.reduce((sum, d) => sum + getMetricValue(d, selectedMetric), 0) / historicalData.length).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Average</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {Math.max(...historicalData.map(d => getMetricValue(d, selectedMetric))).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Maximum</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {Math.min(...historicalData.map(d => getMetricValue(d, selectedMetric))).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Minimum</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {(Math.max(...historicalData.map(d => getMetricValue(d, selectedMetric))) - 
                Math.min(...historicalData.map(d => getMetricValue(d, selectedMetric)))).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Range</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl">Detailed Historical Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#4F4F59]">
                  <th className="text-left text-white/70 p-2">Date</th>
                  <th className="text-left text-white/70 p-2">OEE (%)</th>
                  <th className="text-left text-white/70 p-2">Availability (%)</th>
                  <th className="text-left text-white/70 p-2">Performance (%)</th>
                  <th className="text-left text-white/70 p-2">Quality (%)</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((row, index) => (
                  <tr key={index} className="border-b border-[#4F4F59]">
                    <td className="text-white p-2">{row.date}</td>
                    <td className="text-white p-2 font-medium">{row.oee.toFixed(1)}%</td>
                    <td className="text-white p-2">{row.availability.toFixed(1)}%</td>
                    <td className="text-white p-2">{row.performance.toFixed(1)}%</td>
                    <td className="text-white p-2">{row.quality.toFixed(1)}%</td>
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