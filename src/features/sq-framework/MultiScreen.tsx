import React, { useRef, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiScreenProps {
  children: ReactNode;
}

const MultiScreen: React.FC<MultiScreenProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCooldown) return;
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          handleScroll(window.innerHeight);
          break;
        case 'ArrowUp':
        case 'PageUp':
          handleScroll(-window.innerHeight);
          break;
        default:
          break;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (isCooldown) return;
      handleScroll(event.deltaY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isCooldown) return;
      const touch = event.touches[0];
      handleScroll(touch.clientY - lastScrollTop);
      setLastScrollTop(touch.clientY);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel);
      container.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchmove', handleTouchMove);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCooldown, lastScrollTop]);

  const handleScroll = (delta: number) => {
    const container = containerRef.current;
    if (!container) return;

    const screenHeight = window.innerHeight;
    const isScrollingDown = delta > 0;

    const currentScreen = Math.round(container.scrollTop / screenHeight);

    // Calculate the next screen position based on scroll direction
    const targetScroll = isScrollingDown
      ? (currentScreen + 1) * screenHeight
      : (currentScreen - 1) * screenHeight;

    container.scrollTo({ top: targetScroll, behavior: 'smooth' });

    // Set cooldown
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 500); // Cooldown of 500ms
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        overflowY: 'hidden',
        scrollSnapType: 'y mandatory',
      }}
    >
      <AnimatePresence>
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MultiScreen;