import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../features/auth/context/AuthContext';
import { useSystem } from './contexts/SystemContext';
import { useModal } from './contexts/ModalContext';
import { ProfileDetails } from '../features/profiles/profiles.types';
import { getProfileDetailsViaID } from '../features/profiles/services/profileService';
import { getUser } from '../features/auth/services/authService';

import LoadingScreen from '../features/sq-framework/LoadingScreen';
import { IMAGES_TO_PRELOAD } from './constants/constants';

import LoadingModal from '../features/sq-framework/modals/LoadingModal';
import NotifyModal from '../features/sq-framework/modals/NotifyModal';
import LoginModal from '../features/sq-framework/modals/LoginModal';

const GlobalScript: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appLoading, setAppLoading] = useState(false);
  const systemContext = useSystem();
  const authContext = useAuth();
  const modalContext = useModal();
  const navigate = useNavigate();

  ///////////////////////////////
  // Load on App Start
  ///////////////////////////////
  useEffect(() => {
    // On app start codes
    const onAppStart = async () => {
      console.log('[AUTH] GlobalScript: onAppStart -> begin');
      await onAppStartLoading();

      // Preload all images in IMAGES_TO_PRELOAD
      Promise.all(
        IMAGES_TO_PRELOAD.map((src) => {
          return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = img.onerror = () => resolve(true);
            img.src = src;
          });
        })
      ).then(() => {
        // Assets are fully loaded on this part
        systemContext.setAppLoaded(true);
        setAppLoading(false);
        console.log('[AUTH] GlobalScript: onAppStart -> assets loaded, appLoading=false');
      });
    };

    if (systemContext.appLoaded || appLoading) return;
    setAppLoading(true);
    onAppStart();
  }, []);

  ///////////////////////////////
  // Load User Data
  // - This loads each time the user changes
  ///////////////////////////////
  useEffect(() => {
    if (authContext.uid) {
      console.log('[AUTH] GlobalScript: uid changed -> setReloadAuthData(true)', { uid: authContext.uid });
      authContext.setReloadAuthData(true);
    } else {
      // Clear auth state when user logs out or uid is cleared
      console.log('[AUTH] GlobalScript: uid cleared -> resetting auth state');
      authContext.setAuthDetails(null);
      authContext.setIsAuthenticated(false);
    }
  }, [authContext.uid]);

  ///////////////////////////////
  // Refresh User
  // - This runs each time we want to fetch updated data from the user
  ///////////////////////////////
  useEffect(() => {
    if (!authContext.reloadAuthData || !authContext.uid) return;

    (async () => {
      console.log('[AUTH] GlobalScript: refreshUser() start', { uid: authContext.uid });
      await refreshUser();
      authContext.setReloadAuthData(false);
      console.log('[AUTH] GlobalScript: refreshUser() done');
    })();
  }, [authContext.reloadAuthData, authContext.uid]);

  const refreshUser = async () => {
    const hasUser = await refreshUserDetails();
    if (!hasUser){
      console.error('[AUTH] GlobalScript: Failed to refresh user (non-destructive)');
      // Keep current auth state; this avoids flicker if profile endpoint briefly fails.
      // Consider adding a retry/backoff here if needed.
    }

    // Mark all datas that rely on user data as ready to be reloaded
    console.log('[AUTH] GlobalScript: marking user data as reloaded');
    authContext.setAuthDataLastReloadTime(new Date().toISOString());
    console.log('[AUTH] GlobalScript: isAuthenticated', authContext.isAuthenticated);
  }

  const refreshUserDetails = async () => {
    if (!authContext.uid){
      console.error('[AUTH] GlobalScript: refreshUserDetails -> User ID is null');
      return false;
    }

    // Fetch latest profile details
    console.log('[AUTH] GlobalScript: fetching profile details', { uid: authContext.uid });
    const newUserDetails: ProfileDetails | null = await getProfileDetailsViaID(authContext.uid!);
    if (!newUserDetails){
      console.error('[AUTH] GlobalScript: Failed to fetch user details (no profile found)');
      // Redirect user to set up profile page
      const url = `/set-profile/${authContext.uid}`;
      console.log('[AUTH] GlobalScript: redirecting to set-profile', { url });
      navigate(url);
      return false;
    }

    console.log('[AUTH] GlobalScript: fetched profile details', newUserDetails);
    authContext.setAuthDetails({
      id: newUserDetails.id,
      email: newUserDetails.email,
    });
    authContext.setIsAuthenticated(true);
    authContext.setUid(newUserDetails.id);
    return true;
  }

  const onAppStartLoading = async () => {
    // Attempt to restore session from httpOnly cookies
    try {
      console.log('[AUTH] GlobalScript: onAppStartLoading -> getUser()');
      const { user } = await getUser();
      if (user && user.id) {
        // Set minimal auth state; downstream effects will load profile details
        console.log('[AUTH] GlobalScript: onAppStartLoading -> found user', { userId: user.id });
        authContext.setIsAuthenticated(true);
        authContext.setUid(user.id);
      } else {
        console.log('[AUTH] GlobalScript: onAppStartLoading -> no user');
        authContext.setIsAuthenticated(false);
        authContext.setUid(null);
      }
    } catch (e) {
      // Non-fatal; proceed without an authenticated user
      console.log('[AUTH] GlobalScript: onAppStartLoading -> exception');
      authContext.setIsAuthenticated(false);
      authContext.setUid(null);
    }
  }

  return (
    <>
      {!appLoading && children}
      
      {/* Global Modals */}
      <LoadingModal />
      <NotifyModal />
      <LoginModal closePopup={() => modalContext.setIsLoginModalOpen(false)} />
      
      {/* Main */}
      <LoadingScreen isShow={appLoading} />
    </>
  );
};

export default GlobalScript;