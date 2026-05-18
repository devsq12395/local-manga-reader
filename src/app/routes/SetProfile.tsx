import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../../features/auth/context/AuthContext';
import { setProfileUsername } from '../../features/profiles/services/profileSetupService';

const SetProfile: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { token, fontFamily } = useTheme();
  const auth = useAuth();

  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!uid) {
      setError('Missing user id');
      return;
    }
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setSubmitting(true);
    try {
      console.log('[AUTH] SetProfile: submit', { uid, username });
      const { data, error } = await setProfileUsername(uid, username.trim());
      if (error) {
        setError(error.message);
        return;
      }
      // If the current session is for a different id somehow, bounce to home
      if (auth.uid && auth.uid !== uid) {
        console.warn('[AUTH] SetProfile: session uid differs from path uid', { sessionUid: auth.uid, uid });
      }
      // Navigate back to home (or wherever you want)
      navigate('/');
    } catch (e: any) {
      setError(e?.message || 'Failed to set profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: token('page.bg'), color: token('text.primary'), fontFamily: fontFamily('inter') }}>
      <div className="w-full max-w-md rounded-lg shadow p-6" style={{ backgroundColor: token('card.bg'), border: `1px solid ${token('card.border')}` }}>
        <h1 className="text-xl font-semibold mb-4">Set up your profile</h1>
        <p className="text-sm mb-6" style={{ color: token('text.secondary') }}>
          Choose a username to complete your profile.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded border focus:outline-none"
              style={{
                backgroundColor: token('input.bg'),
                borderColor: token('input.border'),
                color: token('text.primary'),
              }}
              placeholder="your_name"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 rounded font-medium"
            style={{
              backgroundColor: token('button.primary.bg'),
              color: token('button.primary.text'),
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetProfile;
