import React, { useEffect, useRef, useState } from 'react';

import Button from '../buttons/Button';
import BaseModal from './BaseModal';
import { useModal } from '../../../app/contexts/ModalContext';
import { Checkmark } from '../ui-elements/Checkmark';
import { Crossmark } from '../ui-elements/Crossmark';


/*
*
* NotifyModal.tsx - VERSION 1.4 - 2025-10-08
* - Renamed some variables for clarity and cleaned up ModalContext.tsx
*
*
*
*/

type NotifyModalProps = {
  durationMs?: number;
};

const NotifyModal: React.FC<NotifyModalProps> = ({ durationMs = 2500 }) => {
  const modalContext = useModal();
  const [progress, setProgress] = useState<number>(100);
  const closeTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Duration useEffect
  useEffect(() => {
    if (modalContext.isNotifyModalOpen && modalContext.notifyModalType === "timer") {
      // Reset to full first to ensure the transition reliably starts from 100%
      setProgress(100);
      // Use double rAF to guarantee the browser processes the style change
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = window.requestAnimationFrame(() => {
          setProgress(0);
        });
      });
      closeTimeoutRef.current = window.setTimeout(() => {
        onModalClose();
      }, durationMs);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      modalContext.setNotifyOnClose(undefined);
    };
  }, [modalContext.isNotifyModalOpen, modalContext.notifyModalType, durationMs]);

  const onModalClose = () => {
    setProgress(100);
    modalContext.setIsNotifyModalOpen(false);
    try {
      if (modalContext.notifyonClose) {
        modalContext.notifyonClose();
      } 
    } finally {
      // Reset to default values
      modalContext.setNotifyModalText("");
      modalContext.setNotifyModalSymbol("check");
      modalContext.setNotifyModalType("timer");
      modalContext.setNotifyOnClose(undefined);
    }
  };

  return (
    <BaseModal 
      isOpen={modalContext.isNotifyModalOpen} setIsOpen={modalContext.setIsNotifyModalOpen} 
      width="40vw" minWidth="300px" height="25vh" minHeight="300px"
      className="z-200"
    >
      <div className="flex flex-col gap-6 items-center justify-center h-full w-full px-6">
        {/* Checkmark and Text */}
        <div className="flex flex-col gap-4 items-center justify-center">
          {modalContext.notifyModalSymbol === "check" ? (
            <Checkmark size={150} color="#22c55e" />
          ) : (
            <Crossmark size={150} color="#ef4444" />
          )}
          <h1 className="text-2xl font-bold text-center">
            {modalContext.notifyModalText || 'Success!'}
          </h1>
        </div>

        {/* Duration Bar */}
        {modalContext.notifyModalType === "timer" && <div className="w-full max-w-xl">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 rounded-full transition-[width] ease-linear"
              style={{ width: `${progress}%`, transitionDuration: `${durationMs}ms` }}
            />
          </div>
        </div>}

        {/* OK Button */}
        {modalContext.notifyModalType === "ok" && <Button
          variant="primary"
          size="lg"
          onClick={onModalClose}
        >OK</Button>}
      </div>
    </BaseModal>
  );
}

export default NotifyModal;