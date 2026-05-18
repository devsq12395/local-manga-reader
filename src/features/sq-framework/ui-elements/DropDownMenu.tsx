import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropDownMenuEntry } from '../../../types/types';

interface DropDownMenuProps {
  parentComponent: React.ReactNode;
  offset: number;
  size: 'small' | 'medium' | 'large';
  entries: DropDownMenuEntry[];
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({ parentComponent, offset, size, entries }) => {
  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return 'w-24';
      case 'medium':
        return 'w-36';
      case 'large':
        return 'w-48';
      default:
        return 'w-36';
    }
  };

  return (
    <div className="relative">
      {parentComponent}
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          transition={{ duration: 0.3 }}
          className={`absolute top-${offset} ${getSizeStyle()} bg-dropdownBg border border-dropdownBorder text-dropdownText`}
        >
          {entries.map((entry, index) => (
            <div key={index} className="cursor-pointer p-2 hover:bg-dropdownBorder" onClick={entry.onClick}>
              {entry.text}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DropDownMenu;