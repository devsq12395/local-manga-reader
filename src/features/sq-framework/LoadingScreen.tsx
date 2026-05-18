import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_LINK } from '../../app/constants/constants';

interface LoadingScreenProps {
  isShow: boolean;
}

// Background variant: no entry animation, only exit animation
const backgroundVariants = {
  exit: {
    opacity: 0,
    transition: { duration: 2.5 }
  }
};

// Variants for logo, loading circle and text
const elementVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 2 } }
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isShow }) => {

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-700 z-1000"
          initial={false} /* Background does not animate on mount */
          animate={{}}
          exit="exit"
          variants={backgroundVariants}
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.img
              src={LOGO_LINK}
              alt="Logo"
              variants={elementVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-1/2 h-auto"
            />
            <style>{`\
              @keyframes spin {\
                from { transform: rotate(0deg); }\
                to { transform: rotate(360deg); }\
              }\
            `}</style>
            <motion.div
              variants={elementVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full"
              style={{
                border: '4px solid #ccc',
                borderTop: '4px solid #333',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            >
              {/* Loading circle element */}
            </motion.div>
            <motion.p
              variants={elementVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-white text-xl"
            >
              Loading, please wait...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;