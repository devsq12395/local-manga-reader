import React from 'react';

import BaseModal from './BaseModal';
import { useModal } from '../../../app/contexts/ModalContext';

const LoadingModal: React.FC = () => {
  const modalContext = useModal();

  return (
    <BaseModal 
      isOpen={modalContext.isLoadingModalOpen} setIsOpen={modalContext.setIsLoadingModalOpen} 
      width="50vw" minWidth="500px" height="25vh" minHeight="300px"
      className="z-200"
    >
      <div className="flex flex-col gap-8 items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <h1 className="text-2xl font-bold">Loading, Please Wait...</h1>
      </div>
    </BaseModal>
  );
}

export default LoadingModal;