import React, { useEffect, useRef, useState } from 'react';
import Button from '../buttons/Button';
import Toggle from '../buttons/Toggle';

import { useModal } from '../../../app/contexts/ModalContext';
import { useAuth } from '../../auth/context/AuthContext';
import { useTheme } from '../../../app/hooks/useTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../auth/services/authService';
import NavSidebar from '../ui-elements/NavSidebar';

const Header: React.FC = () => {
  const modalContext = useModal();
  const authContext = useAuth();
  const { token, themeName, setThemeName } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animTimeoutRef = useRef<number | null>(null);
  const toggleSidebar = () => {
    if (isAnimating) return; // ignore clicks during tween
    setIsSidebarOpen((v) => !v);
    setIsAnimating(true);
    if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
    // Match NavSidebar transition duration-300
    animTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      animTimeoutRef.current = null;
    }, 300);
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    console.log('[AUTH] Header: render', { isAuthenticated: authContext.isAuthenticated, uid: authContext.uid });
  }, [authContext.isAuthenticated, authContext.uid]);

  const profileMenu = [
    { key: 'edit', label: 'Edit Profile' },
    { key: 'logout', label: 'Logout' },
  ];

  const onClickMenu = async (menuName: string) => {
    switch(menuName){
      case 'logout':
        try {
          // Call API to clear session (httpOnly cookie based)
          console.log('[AUTH] Header: logout clicked');
          await logout();
        } finally {
          // Clear local auth state regardless of API outcome
          authContext.setIsAuthenticated(false);
          authContext.setUid(null);
          modalContext.showNotify?.('You have been logged out');
          console.log('[AUTH] Header: logout finished, local state cleared');
        }
        break;
    }
    setMenuOpen(false);
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 z-50" style={{ backgroundColor: token("header.bg"), color: token("header.text") }}>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button
              type="button"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleSidebar}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="p-2 rounded hover:bg-white/10 focus:outline-none cursor-pointer"
              title={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              <FontAwesomeIcon icon={isSidebarOpen ? faXmark : faBars} className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-row items-center gap-6">
            <Toggle
              checked={themeName === 'dark'}
              onChange={(next) => setThemeName(next ? 'dark' : 'light')}
              width={60}
              height={32}
              onColor="#334155"  
              offColor="#f59e0b" 
              onSymbol={<FontAwesomeIcon icon={faMoon} />}
              offSymbol={<FontAwesomeIcon icon={faSun} />}
              iconInset={12}
            />
            {authContext.isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="text-sm font-medium">Profile</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 rounded-md shadow-lg z-50 py-1"
                    style={{
                      backgroundColor: token('dropdown.bg'),
                      border: `1px solid ${token('dropdown.border')}`,
                      color: token('dropdown.text'),
                    }}
                  >
                    {profileMenu.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        role="menuitem"
                        className="block w-full text-left px-4 py-2 text-sm cursor-pointer"
                        onMouseEnter={() => setHoverItem(item.key)}
                        onMouseLeave={() => setHoverItem(null)}
                        onClick={() => onClickMenu(item.key)}
                        style={{
                          backgroundColor: hoverItem === item.key ? token('dropdown.itemHoverBg') : 'transparent',
                          color: token('dropdown.text'),
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Button variant="link" onClick={() => { console.log('[AUTH] Header: Sign In clicked'); modalContext.setIsLoginModalOpen(true); }}>Sign In</Button>
            )}
          </div>
        </div>
      </header>
      {/* Sidebar as a child of Header; positioned below the header */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-50">
        <NavSidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />
      </div>
    </>
  );
}

export default Header;