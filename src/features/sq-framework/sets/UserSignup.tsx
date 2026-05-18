import React, { useState } from 'react';
import { signup, getGoogleOAuthUrl } from '../../auth/services/authService';
import Button from '../buttons/Button';

interface UserSignupProps {
  disabled: boolean;
  closePopup: () => void;
}

const UserSignup: React.FC<UserSignupProps> = ({ disabled, closePopup }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled) {
      setErrorMessage('You must agree to our Terms, Conditions, and Policies to continue.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const { data } = await signup(email, username, password);
      if(data && data.user){
        setSuccessMessage('Signed up succesfully! Check your email to confirm your account.');
      } else {
        setErrorMessage('Signup failed');
      }
    } catch (err: any) {
      setErrorMessage('Signup failed: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    if (disabled) {
      setErrorMessage('You must agree to our Terms, Conditions, and Policies to continue.');
      return;
    }
    try {
      const url = await getGoogleOAuthUrl();
      window.location.href = url;
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not start Google sign-up');
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
      <input
        type="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
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

      <button
        type="submit"
        disabled={loading}
        className={`p-3 rounded w-full ${
          loading ? 'bg-gray-300 cursor-not-allowed text-gray-700' : 'bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer'
        }`}
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>

      <Button
        type="button"
        disabled={loading}
        variant="default"
        onClick={signUpWithGoogle}
      >
        {loading ? 'Signing Up...' : 'Sign up with Google'}
      </Button>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </form>
  );
};

export default UserSignup;
