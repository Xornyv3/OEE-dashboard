import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { DollarSign, CreditCard, TrendingUp, Target, BarChart3 } from "lucide-react";

export const CostProfitSection = (): JSX.Element => {
  const financialMetrics = [
    {
      title: "Total Revenue",
      value: "$125,450",
      change: "+8.2%",
      changeType: "increase",
  icon: <DollarSign className="w-5 h-5" />,
    },
    {
      title: "Production Cost",
      value: "$78,230",
      change: "+3.1%",
      changeType: "increase",
  icon: <CreditCard className="w-5 h-5" />,
    },
    {
      title: "Gross Profit",
      value: "$47,220",
      change: "+15.8%",
      changeType: "increase",
  icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Profit Margin",
      value: "37.6%",
      change: "+2.4%",
      changeType: "increase",
  icon: <Target className="w-5 h-5" />,
    },
  ];

  const costBreakdown = [
    { category: "Raw Materials", amount: 32500, percentage: 41.5 },
    { category: "Labor", amount: 18750, percentage: 24.0 },
    { category: "Energy", amount: 12250, percentage: 15.7 },
    { category: "Maintenance", amount: 8900, percentage: 11.4 },
    { category: "Overhead", amount: 5830, percentage: 7.4 },
  ];

  const profitByProduct = [
    { product: "Engine Block A1", revenue: 45000, cost: 28000, profit: 17000, margin: 37.8 },
    { product: "Transmission B2", revenue: 38500, cost: 24500, profit: 14000, margin: 36.4 },
    { product: "Cylinder Head C3", revenue: 28200, cost: 18200, profit: 10000, margin: 35.5 },
    { product: "Crankshaft D4", revenue: 13750, cost: 7530, profit: 6220, margin: 45.2 },
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((metric, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">{metric.icon}</span>
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
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

      {/* Cost Breakdown and Profit Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.category}</span>
                    <div className="text-right">
                      <div className="text-white">${item.amount.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">{item.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-white/20">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total Cost</span>
                  <span className="text-white">${totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-2xl font-bold text-white">$47.2K</div>
                  <div className="text-white/70 text-sm">This Month</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-white/80">$41.8K</div>
                  <div className="text-white/70 text-sm">Last Month</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-white/60">$38.5K</div>
                  <div className="text-white/70 text-sm">3 Months Ago</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-medium">Profit Trend (Last 6 Months)</h4>
                <div className="grid grid-cols-6 gap-1 h-24">
                  {[65, 72, 68, 78, 85, 92].map((height, index) => (
                    <div key={index} className="flex flex-col justify-end items-center">
                      <div 
                        className="w-full bg-white rounded-t-sm transition-all duration-300"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-white/70 text-xs mt-1">M{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Performance Insight</h4>
                <p className="text-white/70 text-sm">
                  Profit margin improved by 15.8% this month due to optimized production efficiency and reduced waste.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Profitability */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">Product Profitability Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white/70 p-3">Product</th>
                  <th className="text-left text-white/70 p-3">Revenue</th>
                  <th className="text-left text-white/70 p-3">Cost</th>
                  <th className="text-left text-white/70 p-3">Profit</th>
                  <th className="text-left text-white/70 p-3">Margin</th>
                  <th className="text-left text-white/70 p-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {profitByProduct.map((product, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="text-white font-medium p-3">{product.product}</td>
                    <td className="text-white p-3">${product.revenue.toLocaleString()}</td>
                    <td className="text-white p-3">${product.cost.toLocaleString()}</td>
                    <td className="text-green-400 font-medium p-3">${product.profit.toLocaleString()}</td>
                    <td className="text-white p-3">{product.margin.toFixed(1)}%</td>
                    <td className="p-3">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 bg-white`}
                          style={{ width: `${(product.margin / 50) * 100}%` }}
                        ></div>
                      </div>
                    </td>
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