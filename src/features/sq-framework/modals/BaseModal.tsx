/*
  BASE MODAL
  Script version: 1.1
*/

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface BaseModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;

  width: string;
  minWidth: string;
  height: string;
  minHeight: string;

  className?: string;
  closeOnOutsideClick?: boolean;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, setIsOpen, width, minWidth, height, minHeight, className, closeOnOutsideClick = false, children }) => {  
  return (
    <AnimatePresence>
      {isOpen && <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center`}
        onClick={(closeOnOutsideClick) ? ()=>setIsOpen(false) : () => {}}
      >
        {/* Box */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          className={`bg-white rounded-lg shadow-xl ${className}`}
          style={{ width, minWidth, height, minHeight }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
};

export default BaseModal;
