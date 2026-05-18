import React, { createContext, useState, useContext, useCallback } from 'react';

interface ModalContextType {
  // Login Modal
  isTermsAndPrivacyPopupOpen: boolean;
  isLoginModalOpen: boolean;
  setIsTermsAndPrivacyPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Loading Modal
  isLoadingModalOpen: boolean;
  setIsLoadingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Notify Modal
  isNotifyModalOpen: boolean;
  notifyModalText: string; notifyonClose?: () => void;
  setIsNotifyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifyModalText: React.Dispatch<React.SetStateAction<string>>;
  setNotifyOnClose: React.Dispatch<React.SetStateAction<(() => void) | undefined>>;
  notifyModalSymbol: string; setNotifyModalSymbol: React.Dispatch<React.SetStateAction<string>>;
  notifyModalType: string; setNotifyModalType: React.Dispatch<React.SetStateAction<string>>;
  showNotify: (message: string, onClose?: () => void, options?: { symbol?: string; type?: string }) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Login Modal
  const [isTermsAndPrivacyPopupOpen, setIsTermsAndPrivacyPopupOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Loading Modal
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState<boolean>(false);

  // Notify Modal
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);
  const [notifyModalText, setNotifyModalText] = useState<string>("");
  const [notifyonClose, setNotifyOnClose] = useState<(() => void) | undefined>(undefined);
  const [notifyModalSymbol, setNotifyModalSymbol] = useState<string>("check");
  const [notifyModalType, setNotifyModalType] = useState<string>("timer");
  const showNotify = useCallback((message: string, onClose?: () => void, options?: { symbol?: string; type?: string }) => {
    setNotifyModalText(message);
    setNotifyOnClose(() => onClose);
    setIsNotifyModalOpen(true);
    setNotifyModalSymbol(options?.symbol ?? "check");
    setNotifyModalType(options?.type ?? "timer");
  }, []);

  return (
    <ModalContext.Provider value={{ 
      // Login Modal
      isTermsAndPrivacyPopupOpen, setIsTermsAndPrivacyPopupOpen,
      isLoginModalOpen, setIsLoginModalOpen,
      // Loading Modal
      isLoadingModalOpen, setIsLoadingModalOpen,

      // Notify Modal
      isNotifyModalOpen, setIsNotifyModalOpen,
      notifyModalText, setNotifyModalText,
      notifyonClose, setNotifyOnClose,
      notifyModalSymbol, setNotifyModalSymbol,
      notifyModalType, setNotifyModalType,
      showNotify
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};