import { useMemo } from 'react';
import { useAuth, type Role } from './auth';

export type Permissions = {
  canViewScheduling: boolean;
  canEditScheduling: boolean;
  canViewQuality: boolean;
  canViewEquipment: boolean;
  canViewProductionAnalytics: boolean;
  canViewInventory: boolean; // detailed inventory
  canViewSupplyChainDeep: boolean; // end-to-end visibility
};

const ALL: Permissions = {
  canViewScheduling: true,
  canEditScheduling: true,
  canViewQuality: true,
  canViewEquipment: true,
  canViewProductionAnalytics: true,
  canViewInventory: true,
  canViewSupplyChainDeep: true,
};

const NONE: Permissions = {
  canViewScheduling: false,
  canEditScheduling: false,
  canViewQuality: false,
  canViewEquipment: false,
  canViewProductionAnalytics: false,
  canViewInventory: false,
  canViewSupplyChainDeep: false,
};

const PERMS: Record<Role, Permissions> = {
  administrator: ALL,
  quality: {
    ...NONE,
    canViewScheduling: true,
    canViewQuality: true,
    canViewProductionAnalytics: true,
  },
  operations: {
    ...NONE,
    canViewScheduling: true,
    canEditScheduling: true,
    canViewProductionAnalytics: true,
    canViewInventory: true,
    canViewSupplyChainDeep: true,
  },
  maintenance: {
    ...NONE,
    canViewEquipment: true,
    canViewScheduling: true,
  },
  production: {
    ...NONE,
    canViewScheduling: true,
    canEditScheduling: true,
    canViewQuality: true,
    canViewEquipment: true,
    canViewProductionAnalytics: true,
    // Explicitly restricted per requirements
    canViewInventory: false,
    canViewSupplyChainDeep: false,
  },
  // Legacy roles mapping
  operator: {
    ...NONE,
    canViewScheduling: true,
  },
  supervisor: {
    ...NONE,
    canViewScheduling: true,
    canEditScheduling: true,
    canViewProductionAnalytics: true,
  },
  manager: {
    ...NONE,
    canViewScheduling: true,
    canEditScheduling: true,
    canViewQuality: true,
    canViewEquipment: true,
    canViewProductionAnalytics: true,
  },
  executive: ALL,
};

export function permissionsFor(role: Role): Permissions {
  return PERMS[role] ?? PERMS.operator;
}

export function usePermissions(): Permissions {
  const { role } = useAuth();
  return useMemo(() => permissionsFor(role), [role]);
}
