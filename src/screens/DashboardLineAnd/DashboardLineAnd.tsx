import { useState } from "react";
import { DailyProductionOverviewSection } from "./sections/DailyProductionOverviewSection";
import { DataRefreshSection } from "./sections/DataRefreshSection";
import { ErrorRateChartSection } from "./sections/ErrorRateChartSection";
import { HeaderSection } from "./sections/HeaderSection";
import { MachineInfoSection } from "./sections/MachineInfoSection";
import { MachineStatusSection } from "./sections/MachineStatusSection";
import { NavigationMenuSection } from "./sections/NavigationMenuSection";
import { ProductionMetricsSection } from "./sections/ProductionMetricsSection";
import { GeneralInfoSection } from "./sections/GeneralInfoSection";
import { WorkingOrderFollowUpSection } from "./sections/WorkingOrderFollowUpSection";
import { DowntimeStopSection } from "./sections/DowntimeStopSection";
import { HistoricalDataSection } from "./sections/HistoricalDataSection";
import { MachineMaintenanceSection } from "./sections/MachineMaintenanceSection";
import { EnergySustainabilitySection } from "./sections/EnergySustainabilitySection";
import { CostProfitSection } from "./sections/CostProfitSection";
import { OEEDataInputSection } from "./sections/OEEDataInputSection";
import { SettingsSection } from "./sections/SettingsSection";
import { DashboardOverviewSection } from "./sections/DashboardOverviewSection";
import { MachineLinePerformanceSection } from "./sections/MachineLinePerformanceSection";
import { KPIDashboardSection } from "./sections/KPIDashboardSection";
import { PlanningSection } from "./sections/PlanningSection";
import { RoleHomeSection } from "./sections/RoleHomeSection";
import { RealTimeMonitoringSection } from "./sections/RealTimeMonitoringSection";
import { MaintenancePdMSection } from "./sections/MaintenancePdMSection";
import { QualityTraceabilitySection } from "./sections/QualityTraceabilitySection";
import { AdvancedAnalyticsSection } from "./sections/AdvancedAnalyticsSection";

export type ActiveTab =
  | "general-info"
  | "dashboard-line-machine"
  | "machine-line-performance"
  | "kpi-dashboard"
  | "working-order-follow-up"
  | "downtime-stop"
  | "dashboard-count"
  | "historical-data"
  | "machine-maintenance"
  | "energy-monitoring"
  | "cost-profit"
  | "oee-data-input"
  | "planning"
  | "role-home"
  | "real-time-monitoring"
  | "maintenance-pdm"
  | "quality-traceability"
  | "advanced-analytics"
  | "energy-sustainability"
  | "settings";

export const DashboardLineAnd = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard-line-machine");

  const renderContent = () => {
    switch (activeTab) {
      case "general-info":
        return <GeneralInfoSection />;
      case "dashboard-line-machine":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-semibold">Dashboard Overview</h2>
            </div>
            {/* New non-editable overview at the top */}
            <DashboardOverviewSection />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MachineStatusSection />
              <ProductionMetricsSection />
            </div>
            <DailyProductionOverviewSection />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <ErrorRateChartSection />
                <DataRefreshSection />
              </div>
              <MachineInfoSection />
            </div>
          </div>
        );
      case "machine-line-performance":
        return (
          <div className="space-y-6">
            <MachineLinePerformanceSection />
          </div>
        );
      case "kpi-dashboard":
        return (
          <div className="space-y-6">
            <KPIDashboardSection />
          </div>
        );
      case "working-order-follow-up":
        return <WorkingOrderFollowUpSection />;
      case "downtime-stop":
        return <DowntimeStopSection />;
      // Deprecated: consolidated into Overview/Realtime
      // case "dashboard-count":
      //   return <DashboardCountSection />;
      case "historical-data":
        return <HistoricalDataSection />;
      case "machine-maintenance":
        return <MachineMaintenanceSection />;
      case "maintenance-pdm":
        return (
          <div className="space-y-6">
            <MaintenancePdMSection />
          </div>
        );
      // Deprecated: replaced by Energy & Sustainability
      // case "energy-monitoring":
      //   return <EnergyMonitoringSection />;
      case "energy-sustainability":
        return (
          <div className="space-y-6">
            <EnergySustainabilitySection />
          </div>
        );
      case "cost-profit":
        return <CostProfitSection />;
      case "oee-data-input":
        return <OEEDataInputSection />;
      case "planning":
        return (
          <div className="space-y-6">
            <PlanningSection />
          </div>
        );
      case "role-home":
        return (
          <div className="space-y-6">
            <RoleHomeSection />
          </div>
        );
      case "real-time-monitoring":
        return (
          <div className="space-y-6">
            <RealTimeMonitoringSection />
          </div>
        );
      case "quality-traceability":
        return (
          <div className="space-y-6">
            <QualityTraceabilitySection />
          </div>
        );
      case "advanced-analytics":
        return (
          <div className="space-y-6">
            <AdvancedAnalyticsSection />
          </div>
        );
      case "settings":
        return <SettingsSection />;
      default:
        return <div className="text-white">Content not found</div>;
    }
  };

  return (
    <div className="bg-[#020202] text-white flex w-screen min-h-screen relative overflow-hidden hide-scrollbar font-sans">
      {/* Futuristic decorative background: subtle grid + multi-color gradient orbs (no animations) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* faint grid */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:40px_40px]" />

        {/* soft center vignette (very subtle to keep black) */}
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

        {/* purple → blue orb (top-right) */}
        <div className="absolute -top-56 -right-56 w-[720px] h-[720px] rounded-full blur-[120px] opacity-[0.4] mix-blend-screen bg-gradient-to-br from-[#553FFE] via-[#3B82F6] to-[#146EF5]" />
        {/* pink → purple orb (top-left) */}
        <div className="absolute -top-72 -left-48 w-[640px] h-[640px] rounded-full blur-[120px] opacity-[0.35] mix-blend-screen bg-gradient-to-tr from-[#FF6FD8] to-[#553FFE]" />
        {/* blue → pink orb (bottom-left) */}
        <div className="absolute -bottom-64 -left-40 w-[680px] h-[680px] rounded-full blur-[120px] opacity-[0.35] mix-blend-screen bg-gradient-to-tr from-[#146EF5] to-[#FF6FD8]" />
        {/* purple highlight (bottom-right) - fixed invalid opacity class and increased contrast */}
        <div className="absolute -bottom-80 -right-20 w-[520px] h-[520px] rounded-full blur-[120px] opacity-[0.28] mix-blend-screen bg-gradient-to-tl from-[#553FFE] to-transparent" />

        {/* accent light beams */}
        <div className="absolute top-1/3 -left-40 w-[900px] h-px rotate-[20deg] bg-gradient-to-r from-[#FF6FD8]/30 via-[#3B82F6]/30 to-transparent blur-sm" />
        <div className="absolute bottom-1/4 -right-40 w-[1000px] h-px -rotate-[25deg] bg-gradient-to-l from-[#553FFE]/25 via-[#FF6FD8]/25 to-transparent blur-sm" />
      </div>
      
      {/* Left Navigation Menu */}
      <aside className="group w-20 hover:w-72 transition-all duration-200 ease-in-out flex-shrink-0 relative z-10 border-r border-[#4F4F59] bg-[#020202]">
        <NavigationMenuSection activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <HeaderSection />

        {/* Main Dashboard Content */}
        <div className="flex-1 p-8 overflow-auto hide-scrollbar bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div>
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};