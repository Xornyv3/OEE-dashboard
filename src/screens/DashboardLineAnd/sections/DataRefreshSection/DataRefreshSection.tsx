import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Package } from "lucide-react";
import { Switch } from "../../../../components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";

export const DataRefreshSection = (): JSX.Element => {
  const pctToWidthClass = (pct: string) => {
    const n = parseInt(pct.replace('%', ''), 10) || 0;
    if (n >= 95) return 'w-full';
    if (n >= 75) return 'w-3/4';
    if (n >= 50) return 'w-1/2';
    if (n >= 25) return 'w-1/4';
    return 'w-0';
  };
  const workOrderData = [
    {
      refOrder: "WO-001",
      article: "Part-A123",
      plannedQty: "500",
      producedQty: "350",
      leftToProduce: "150",
      progression: "70%",
    },
    {
      refOrder: "WO-002", 
      article: "Part-B456",
      plannedQty: "300",
      producedQty: "280",
      leftToProduce: "20",
      progression: "93%",
    },
    {
      refOrder: "WO-003",
      article: "Part-C789", 
      plannedQty: "200",
      producedQty: "50",
      leftToProduce: "150",
      progression: "25%",
    },
  ];

  return (
    <Card className="rounded-[6px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white text-[18px] leading-[24px] font-bold tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#191921] border border-[#4F4F59] text-white flex items-center justify-center"><Package className="w-5 h-5" /></div>
              Working Order Progression
            </CardTitle>
            <p className="text-white/70 text-[14px] leading-[20px] mt-1">Progress of current production orders</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">Auto refresh (5s)</span>
              <Switch className="data-[state=checked]:bg-[#3898EC] data-[state=unchecked]:bg-[#4F4F59]" defaultChecked />
            </div>
            <Button 
              variant="outline"
              className="bg-transparent border-[#4F4F59] text-white hover:bg-[#191921]"
            >
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto hide-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-[#4F4F59]">
                <TableHead className="text-white/70 font-medium">Ref Working Order</TableHead>
                <TableHead className="text-white/70 font-medium">Reference Article</TableHead>
                <TableHead className="text-white/70 font-medium">Planned Quantity</TableHead>
                <TableHead className="text-white/70 font-medium">Produced Quantity</TableHead>
                <TableHead className="text-white/70 font-medium">Left to Produce</TableHead>
                <TableHead className="text-white/70 font-medium">Progression</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrderData.map((row, index) => (
                <TableRow key={index} className="border-[#4F4F59]">
                  <TableCell className="text-white font-medium">{row.refOrder}</TableCell>
                  <TableCell className="text-white">{row.article}</TableCell>
                  <TableCell className="text-white">{row.plannedQty}</TableCell>
                  <TableCell className="text-white">{row.producedQty}</TableCell>
                  <TableCell className="text-white">{row.leftToProduce}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#4F4F59] rounded-full h-2">
                        <div className={`bg-white h-2 rounded-full ${pctToWidthClass(row.progression)}`}></div>
                      </div>
                      <span className="text-white text-sm">{row.progression}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};