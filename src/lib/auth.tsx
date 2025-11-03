import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Role =
  | 'administrator'
  | 'quality'
  | 'operations'
  | 'maintenance'
  | 'production'
  // Legacy roles kept for compatibility with existing views
  | 'operator'
  | 'supervisor'
  | 'manager'
  | 'executive';

type AuthState = {
  role: Role;
  setRole: (r: Role) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    const raw = localStorage.getItem('auth:role');
    return (raw as Role) || 'production';
  });
  const setRole = (r: Role) => setRoleState(r);

  useEffect(() => { localStorage.setItem('auth:role', role); }, [role]);

  const value = useMemo(() => ({ role, setRole }), [role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
