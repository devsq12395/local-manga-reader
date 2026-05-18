import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from '../../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBookOpenReader, faLayerGroup, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface NavSidebarProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  onSelect?: (id: string) => void;
  activeId?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: IconDefinition;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'User Dashboard', icon: faUser },
  { id: 'study', label: 'Study', icon: faBookOpenReader },
  { id: 'all', label: 'All Learnings', icon: faLayerGroup },
];

const NavSidebar: React.FC<NavSidebarProps> = ({ isOpen, toggleDrawer, onSelect, activeId }) => {
  const [ menuItems ] = useState<MenuItem[]>(DEFAULT_ITEMS);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { token, fontFamily } = useTheme();

  // Outside Click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        toggleDrawer();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, toggleDrawer]);

  const isActive = (id: string) => id === (activeId ?? menuItems[0].id);

  return (
    <div 
      ref={drawerRef} 
      aria-hidden={!isOpen}
      style={{ backgroundColor: token('section.bg'), borderRight: `1px solid ${token('section.border')}` }}
      className={`w-64 md:w-72 h-full shadow-lg z-10 transition-transform duration-300 ${isOpen ? 'transform-none pointer-events-auto' : '-translate-x-full pointer-events-none'}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${token('section.border')}` }}>
          <div className="text-lg font-semibold" style={{ fontFamily: fontFamily('raleway'), color: token('page.text') }}>
            Menu
          </div>
        </div>

        {/* Items */}
        <nav className="flex-1 py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              className="w-full flex items-center gap-3 px-5 py-3 text-left cursor-pointer hover:bg-white/10"
              style={{
                color: token('page.text'),
                fontFamily: fontFamily('inter'),
                backgroundColor: isActive(item.id) ? 'rgba(59,130,246,0.12)' : 'transparent',
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 text-xs opacity-70" style={{ color: token('page.text'), fontFamily: fontFamily('inter'), borderTop: `1px solid ${token('section.border')}` }}>
          {new Date().getFullYear()} Shirley
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;