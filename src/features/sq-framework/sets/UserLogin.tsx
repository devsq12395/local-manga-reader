import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getUser, getGoogleOAuthUrl } from '../../auth/services/authService';
import { useAuth } from '../../auth/context/AuthContext';
import Button from '../buttons/Button';

interface UserLoginProps {
  disabled: boolean;
  closePopup: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ disabled, closePopup }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUid } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled) {
      setErrorMessage('You must agree to our Terms, Conditions, and Policies to continue.');
      return;
    }
    setIsLoggingIn(true);
    setErrorMessage(null);

    try {
      console.log('[AUTH] UserLogin: handleLogin -> calling login()', { email });
      const { data } = await login(email, password);
      if(data && data.user){
        console.log('[AUTH] UserLogin: handleLogin -> login success', { userId: data.user.id });
        setIsAuthenticated(true);
        setUid(data.user.id);
        closePopup();
      } else {
        console.log('[AUTH] UserLogin: handleLogin -> login returned no user');
        setErrorMessage('Login failed');
      }
    } catch (err: any) {
      console.log('[AUTH] UserLogin: handleLogin -> exception', { message: err?.message });
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signInWithGoogle = async () => {
    if (disabled) {
      setErrorMessage('You must agree to our Terms, Conditions, and Policies to continue.');
      return;
    }
    try {
      console.log('[AUTH] UserLogin: signInWithGoogle -> getGoogleOAuthUrl()');
      const url = await getGoogleOAuthUrl();
      window.location.href = url; // goes to Google, then back to your backend callback which sets cookies
    } catch (err: any) {
      console.log('[AUTH] UserLogin: signInWithGoogle -> exception', { message: err?.message });
      setErrorMessage(err.message || 'Could not start Google sign-in');
    }
  };

  // On mount (and after returning from Google) check if we already have a session cookie
  useEffect(() => {
    (async () => {
      console.log('[AUTH] UserLogin: mount -> getUser()');
      const data = await getUser();
      const user = data.user;
      if (user && user.id) {
        console.log('[AUTH] UserLogin: mount -> found existing session', { userId: user.id });
        setIsAuthenticated(true);
        setUid(user.id);
        closePopup();
      }
    })();
  }, []);

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />

      <Button
        type="submit"
        disabled={isLoggingIn}
        variant="default"
        className="w-full bg-indigo-500 hover:bg-indigo-600"
      >
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </Button>

      <Button
        type="button"
        disabled={isLoggingIn}
        variant="default"
        className="w-full"
        onClick={signInWithGoogle}
      >
        {isLoggingIn ? 'Logging in...' : 'Sign in with Google'}
      </Button>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default UserLogin;
