import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { useSelection } from "../../../../lib/selection";

export const MachineDetailSection = (): JSX.Element => {
  const { selectedMachine } = useSelection();
  if (!selectedMachine) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl">Machine Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/70">Select a machine to view detailed analytics.</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-white text-xl">Machine: {selectedMachine}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/80 text-sm">Root-cause analysis, recent alerts, component failures, and parameter anomalies will be shown here.</div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">MTTR/MTBF Trends</CardTitle></CardHeader>
          <CardContent>
            <div className="text-white/70 text-sm">Predictive maintenance insights based on trend analysis.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-white text-xl">Performance Over Time</CardTitle></CardHeader>
          <CardContent>
            <div className="text-white/70 text-sm">Historical TRS/TEEP performance chart with time range controls.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
