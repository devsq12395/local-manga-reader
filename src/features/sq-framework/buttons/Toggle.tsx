import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  // Optional sizing override (px). Defaults provide a good appearance.
  width?: number; // overall width of the switch
  height?: number; // overall height of the switch
  // Customization
  onColor?: string;  // background color when checked
  offColor?: string; // background color when unchecked
  onSymbol?: React.ReactNode; // icon/content shown in checked state
  offSymbol?: React.ReactNode; // icon/content shown in unchecked state
  iconInset?: number; // px inset for icons away from knob/edges
};

// Simple utility to clamp knob size and positions
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  width = 56,
  height = 32,
  onColor = '#16a34a',
  offColor = '#ef4444',
  onSymbol = <FontAwesomeIcon icon={faCheck} />,
  offSymbol = <FontAwesomeIcon icon={faXmark} />,
  iconInset = 10,
}) => {
  const knobSize = clamp(height - 6, 18, 28); // maintain some padding and a nice look
  const knobX = checked ? width - knobSize - 4 : 4;

  const trueColor = onColor; // checked color
  const falseColor = offColor; // unchecked color

  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
    if (e.key === 'ArrowLeft') {
      onChange(false);
    } else if (e.key === 'ArrowRight') {
      onChange(true);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'On' : 'Off'}
      disabled={disabled}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{ width, height }}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: checked ? trueColor : falseColor }}
        initial={false}
        animate={{ backgroundColor: checked ? trueColor : falseColor }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />

      {/* Icons area with two halves so the knob never sits on top of the active icon */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Left half (used when checked/on) */}
        <div className="absolute left-0 top-0 h-full w-1/2 flex items-center justify-center" style={{ paddingLeft: iconInset }}>
          <AnimatePresence initial={false} mode="wait">
            {checked ? (
              <motion.span
                key="on"
                initial={{ opacity: 0, scale: 0.6, x: -iconInset }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.6, x: -iconInset }}
                transition={{ duration: 0.15 }}
                className="text-white text-[12px]"
              >
                {onSymbol}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Right half (used when unchecked/off) */}
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center" style={{ paddingRight: iconInset }}>
          <AnimatePresence initial={false} mode="wait">
            {!checked ? (
              <motion.span
                key="off"
                initial={{ opacity: 0, scale: 0.6, x: iconInset }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.6, x: iconInset }}
                transition={{ duration: 0.15 }}
                className="text-white text-[12px]"
              >
                {offSymbol}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Knob */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 rounded-full shadow-md bg-white z-20"
        style={{ width: knobSize, height: knobSize }}
        initial={false}
        animate={{ x: knobX }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </button>
  );
};

export default Toggle;

