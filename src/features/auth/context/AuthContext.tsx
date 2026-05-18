import React, { createContext, useState, useContext } from 'react';
import { AuthDetails } from '../auth.types';

interface AuthContextType {
  reloadAuthData: boolean;
  authDataLastReloadTime: string;
  authDetails: AuthDetails | null;

  isAuthenticated: boolean;
  uid: string | null;

  setReloadAuthData: (value: boolean) => void;
  setAuthDataLastReloadTime: (value: string) => void;
  setAuthDetails: (value: AuthDetails | null) => void;

  setIsAuthenticated: (value: boolean) => void;
  setUid: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reloadAuthData, setReloadAuthData] = useState<boolean>(false);
  const [authDataLastReloadTime, setAuthDataLastReloadTime] = useState<string>("");
  const [authDetails, setAuthDetails] = useState<AuthDetails | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ 
      reloadAuthData, setReloadAuthData,
      authDataLastReloadTime, setAuthDataLastReloadTime,
      authDetails, setAuthDetails,

      isAuthenticated, setIsAuthenticated, 
      uid, setUid
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};