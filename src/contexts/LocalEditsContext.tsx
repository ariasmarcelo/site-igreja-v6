import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

interface LocalEditsContextType {
  setLocalEdit: (key: string, value: string) => void;
  clearLocalEdits: () => void;
  getValueWithOverride: (key: string, originalValue: string) => string;
}

const LocalEditsContext = createContext<LocalEditsContextType | null>(null);

export function LocalEditsProvider({ children }: { children: ReactNode }) {
  const [localEdits, setLocalEdits] = useState<Map<string, string>>(new Map());

  const setLocalEdit = useCallback((key: string, value: string) => {
    setLocalEdits(prev => {
      const next = new Map(prev);
      next.set(key, value);
      console.log(`💾 Local edit: ${key} = "${value}"`);
      return next;
    });
  }, []);

  const clearLocalEdits = useCallback(() => {
    setLocalEdits(new Map());
    console.log('🧹 Local edits cleared');
  }, []);

  const getValueWithOverride = useCallback((key: string, originalValue: string): string => {
    // Se há edição local para essa chave, usar valor local
    if (localEdits.has(key)) {
      return localEdits.get(key)!;
    }
    // Caso contrário, usar valor original (do Supabase)
    return originalValue;
  }, [localEdits]);

  const contextValue = useMemo(
    () => ({ setLocalEdit, clearLocalEdits, getValueWithOverride }),
    [setLocalEdit, clearLocalEdits, getValueWithOverride]
  );

  return (
    <LocalEditsContext.Provider value={contextValue}>
      {children}
    </LocalEditsContext.Provider>
  );
}

export function useLocalEdits() {
  const context = useContext(LocalEditsContext);
  if (!context) {
    throw new Error('useLocalEdits must be used within LocalEditsProvider');
  }
  return context;
}
