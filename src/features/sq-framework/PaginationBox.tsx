import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './buttons/Button';

interface PaginationBoxProps {
  children: React.ReactNode[];
  style?: React.CSSProperties;
}

const PaginationBox: React.FC<PaginationBoxProps> = ({ children, style }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalPages = children.length;

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : prevPage));
  };

  const variants = {
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden" style={style}>
      <div className="min-h-[75%] flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {children[currentPage]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Button 
          type="button" 
          variant="ghost"
          size="md"
          onClick={handlePrevious}
        >
          ←
        </Button>
        <div className="flex">
          {children.map((_, index) => (
            <span key={index} className={`w-2 h-2 mx-1 rounded-full ${index === currentPage ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
          ))}
        </div>
        <Button 
          type="button" 
          variant="ghost"
          size="md"
          onClick={handleNext}
        >
          →
        </Button>
      </div>
    </div>
  );
};

export default PaginationBox;