import React, { createContext, useState, useContext } from 'react';

interface SystemContextType {
  mode: 'desktop' | 'mobile-portrait' | 'mobile-landscape';
  appLoaded: boolean;

  setMode: React.Dispatch<React.SetStateAction<'desktop' | 'mobile-portrait' | 'mobile-landscape'>>;
  setAppLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'desktop' | 'mobile-portrait' | 'mobile-landscape'>('desktop');
  const [appLoaded, setAppLoaded] = useState(false);

  return (
    <SystemContext.Provider value={{ 
      mode, setMode,
      appLoaded, setAppLoaded
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};