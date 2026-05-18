import React, { useState, ReactElement, Children, isValidElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabDivProps {
  children: React.ReactNode;
  className?: string;
}

const TabDiv: React.FC<TabDivProps> = ({ children, className }) => {
  const validChildren = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const [activeIndex, setActiveIndex] = useState(0);

  const labels = validChildren.map((child, index) => {
    const label = (child.props as { 'data-label': string })['data-label'] || `Tab ${index + 1}`;
    return label;
  });

  return (
    <div className={`flex flex-col max-h-full overflow-y-hidden ${className}`}>
      {/* Tab Buttons */}
      <div className="flex space-x-2 border-b mb-4">
        {labels.map((label, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded-t cursor-pointer ${
              index === activeIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="flex p-4 w-full min-h-[600px] border rounded bg-white shadow overflow-y-auto divide-gray-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {validChildren[activeIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabDiv;
