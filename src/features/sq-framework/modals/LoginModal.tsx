import React, { useState } from 'react';
import UserLogin from '../sets/UserLogin';
import UserSignup from '../sets/UserSignup';

import { motion, AnimatePresence } from "framer-motion";

import { useModal } from '../../../app/contexts/ModalContext';

interface LoginModalProps {
  closePopup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closePopup }) => {
  const modalContext = useModal();
  const [currentTab, setCurrentTab] = useState<'Login' | 'Signup'>('Login');
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const openPoliciesPopup = () => {
    modalContext.setIsTermsAndPrivacyPopupOpen(true);
  };

  return (
    <AnimatePresence>
      {modalContext.isLoginModalOpen && <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" onClick={closePopup}
      >
        {/* Box */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4" onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="flex justify-end">
            <button onClick={closePopup} className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">&times;</button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-300">
            {['Login', 'Signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab as 'Login' | 'Signup')}
                className={`flex-1 px-6 py-2 text-center text-sm font-medium cursor-pointer ${
                  currentTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="p-6">
            {currentTab === 'Login' ? 
            <UserLogin 
              disabled={!isTermsChecked} 
              closePopup={closePopup}
            /> : 
            <UserSignup 
              disabled={!isTermsChecked} 
              closePopup={closePopup}
            />}
          </div>

          {/* Terms Checkbox */}
          <div className="p-6 pt-0 flex justify-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={isTermsChecked} onChange={() => setIsTermsChecked(!isTermsChecked)} />
              <span className="text-sm">
                To login/signup, you must agree to our{' '}
                <span onClick={openPoliciesPopup} className="text-blue-500 underline cursor-pointer">
                  Terms, Conditions, and Policies
                </span>
              </span>
            </label>
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
};

export default LoginModal;
