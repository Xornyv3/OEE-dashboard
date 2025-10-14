import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { getEnergyKpis, listPeakDemandAlarms, getEnergyCostOfLosses, getOpee, getCo2PerOrder, type EnergyKpi, type PeakDemandAlarm, type LossEnergyCost, type Opee, type OrderFootprint } from "../../../../lib/energy";
import { getReferenceStudy, pickScopedBenchmark, type StudyBenchmark } from "../../../../lib/reference";
import { AlertTriangleIcon, LeafIcon, BatteryChargingIcon } from "lucide-react";

export const EnergySustainabilitySection = (): JSX.Element => {
  const [kpis, setKpis] = useState<EnergyKpi | null>(null);
  const [alarms, setAlarms] = useState<PeakDemandAlarm[]>([]);
  const [lossCosts, setLossCosts] = useState<LossEnergyCost[]>([]);
  const [opee, setOpee] = useState<Opee | null>(null);
  const [orderId] = useState<string>('WO-2024-001');
  const [footprint, setFootprint] = useState<OrderFootprint | null>(null);
  const [bench, setBench] = useState<StudyBenchmark | null>(null);

  useEffect(() => {
    (async () => {
      const [ek, al, lc, op, b] = await Promise.all([
        getEnergyKpis('shift'),
        listPeakDemandAlarms(),
        getEnergyCostOfLosses(),
        getOpee(),
        getReferenceStudy(),
      ]);
      setKpis(ek); setAlarms(al); setLossCosts(lc); setOpee(op); setBench(pickScopedBenchmark(b, { line: 'Line 1' }));
      const fp = await getCo2PerOrder(orderId);
      setFootprint(fp);
    })();
  }, [orderId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><BatteryChargingIcon className="w-5 h-5" /> Energy per Part {bench?.kwhPerGoodTarget ? <span className="text-white/50 text-sm ml-2">Target ≤ {bench.kwhPerGoodTarget} kWh/good</span> : null}</CardTitle></CardHeader>
          <CardContent>
            {kpis && (
              <div className="text-white/80 space-y-1">
                <div>kWh per good: {kpis.kwhPerGood}</div>
                <div>kWh per total: {kpis.kwhPerTotal}</div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><AlertTriangleIcon className="w-5 h-5" /> Peak Demand Alarms</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Time</TableHead><TableHead className="text-white/70">kW</TableHead><TableHead className="text-white/70">Threshold</TableHead><TableHead className="text-white/70">Message</TableHead></TableRow></TableHeader>
              <TableBody>
                {alarms.map(a => (
                  <TableRow key={a.id} className="border-white/10">
                    <TableCell className="text-white/80">{new Date(a.occurredAt).toLocaleString()}</TableCell>
                    <TableCell className="text-white/80">{a.kw}</TableCell>
                    <TableCell className="text-white/80">{a.thresholdKw}</TableCell>
                    <TableCell className="text-white/80">{a.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl flex items-center gap-2"><LeafIcon className="w-5 h-5" /> OPE / OEEe</CardTitle></CardHeader>
          <CardContent>
            {opee && (
              <div className="text-white/80 space-y-1">
                <div>Equipment Effectiveness: {Math.round(opee.equipmentEffectiveness*100)}%</div>
                <div>Energy Effectiveness: {Math.round(opee.energyEffectiveness*100)}%</div>
                <div>OEEe: {Math.round(opee.oeee*100)}%</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-white text-xl">Energy Cost of Losses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-white/20"><TableHead className="text-white/70">Loss Type</TableHead><TableHead className="text-white/70">kWh</TableHead><TableHead className="text-white/70">Cost</TableHead></TableRow></TableHeader>
            <TableBody>
              {lossCosts.map((l, idx) => (
                <TableRow key={idx} className="border-white/10">
                  <TableCell className="text-white/80">{l.lossType}</TableCell>
                  <TableCell className="text-white/80">{l.kwh}</TableCell>
                  <TableCell className="text-white/80">${l.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-white text-xl">CO₂ intensity per order {bench?.co2PerOrderTargetKg ? <span className="text-white/50 text-sm ml-2">Target ≤ {bench.co2PerOrderTargetKg} kg</span> : null}</CardTitle></CardHeader>
        <CardContent>
          {footprint && (
            <div className="text-white/80">{footprint.orderId}: {footprint.co2Kg} kg CO₂, {footprint.kwh} kWh</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
