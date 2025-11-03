import type { ActiveTab } from "./DashboardLineAnd";
import type { Permissions } from "../../lib/permissions";
import type { Role } from "../../lib/auth";

// Canonical tab order used by both the menu and the default selection logic
export const orderedTabs: ActiveTab[] = [
  "dashboard-line-machine",
  "real-time-monitoring",
  "maintenance-pdm",
  "quality-traceability",
  "advanced-analytics",
  "role-home",
  "planning",
  "machine-line-performance",
  "working-order-follow-up",
  "dashboard-count",
  "historical-data",
  "machine-maintenance",
  "energy-monitoring",
  "energy-sustainability",
  "cost-profit",
  "oee-data-input",
  "settings",
];

export function isTabVisible(tab: ActiveTab, perms: Permissions, role: Role): boolean {
  switch (tab) {
    // Always available general dashboards
    case "dashboard-line-machine":
    case "real-time-monitoring":
    case "role-home":
      return true;

    // Scheduling / work
    case "planning":
    case "working-order-follow-up":
      return perms.canViewScheduling;

    // Equipment & maintenance
    case "machine-maintenance":
    case "maintenance-pdm":
      return perms.canViewEquipment;

    // Quality
    case "quality-traceability":
      return perms.canViewQuality;

    // Analytics & performance
    case "advanced-analytics":
    case "dashboard-count":
    case "historical-data":
    case "energy-monitoring":
    case "energy-sustainability":
      return perms.canViewProductionAnalytics;

    // Performance dashboard is useful for either analytics or equipment audiences
    case "machine-line-performance":
      return perms.canViewProductionAnalytics || perms.canViewEquipment;

    // Cost/Profit is considered deep supply-chain/finance visibility
    case "cost-profit":
      return perms.canViewSupplyChainDeep;

    // Data input (write capability)
    case "oee-data-input":
      return perms.canEditScheduling;

    // Settings: admin-only
    case "settings":
      return role === "administrator";

    // Fallback deny
    default:
      return false;
  }
}
