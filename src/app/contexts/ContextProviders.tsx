import React from 'react';
import { SystemProvider } from './SystemContext';
import { ModalProvider } from './ModalContext';
import { AuthProvider } from '../../features/auth/context/AuthContext';

interface ContextProvidersProps {
  children: React.ReactNode;
}

const ContextProviders: React.FC<ContextProvidersProps> = ({ children }) => {
  return (
    <SystemProvider>
      <AuthProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </AuthProvider>
    </SystemProvider>
  );
};

export default ContextProviders;