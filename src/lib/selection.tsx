import { createContext, useContext, useMemo, useState } from 'react';

type SelectionState = {
  selectedMachine: string | null;
  setSelectedMachine: (id: string | null) => void;
};

const SelectionContext = createContext<SelectionState | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const value = useMemo(() => ({ selectedMachine, setSelectedMachine }), [selectedMachine]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
}
