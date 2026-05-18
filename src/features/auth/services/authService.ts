
type Err = { message: string };
import { AuthDetails } from "../auth.types";

// Helper to keep fetch calls consistent
const opts = (method: string, body?: any): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: body ? JSON.stringify(body) : undefined,
});

// -----------------------------
// Auth
// -----------------------------

// Login function
export async function login(email: string, password: string) {
  try {
    console.log('[AUTH] login(): sending request', { url: `${import.meta.env.VITE_API_BASE_URL}/auth/login`, email });
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, opts('POST', { email, password }));
    const json = await res.json();
    if (!res.ok) {
      console.log('[AUTH] login(): failed', { status: res.status, body: json });
      return { data: null, error: { message: json.error || 'Login failed' } as Err };
    }
    console.log('[AUTH] login(): success', { userId: json?.user?.id });
    return { data: { user: json.user as AuthDetails }, error: null as any };
  } catch (e: any) {
    console.log('[AUTH] login(): exception', { message: e?.message });
    return { data: null, error: { message: e?.message || 'Login failed' } as Err };
  }
}

// Signup function
export async function signup(email: string, username: string, password: string) {
  try {
    console.log('[AUTH] signup(): sending request', { url: `${import.meta.env.VITE_API_BASE_URL}/auth/signup`, email, username });
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, opts('POST', { email, username, password }));
    const json = await res.json();
    if (!res.ok) {
      console.log('[AUTH] signup(): failed', { status: res.status, body: json });
      return { data: null, error: { message: json.error || 'Signup failed' } as Err };
    }
    console.log('[AUTH] signup(): success', { userId: json?.user?.id, session: !!json?.session });
    // Keep shape similar to Supabase: { user, session }
    return { data: { user: json.user as AuthDetails, session: json.session as boolean }, error: null as any };
  } catch (e: any) {
    console.log('[AUTH] signup(): exception', { message: e?.message });
    return { data: null, error: { message: e?.message || 'Signup failed' } as Err };
  }
}

// Logout function
export async function logout() {
  try {
    console.log('[AUTH] logout(): sending request', { url: `${import.meta.env.VITE_API_BASE_URL}/auth/logout` });
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, opts('POST'));
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.log('[AUTH] logout(): failed', { status: res.status, body: json });
      throw new Error(json.error || 'Logout failed');
    }
    console.log('[AUTH] logout(): success');
  } catch (e) {
    // swallow on FE; user will simply be considered logged out
    console.error(e);
  }
}

// Get current user (cookie-based session)
export async function getUser() {
  try {
    console.log('[AUTH] getUser(): sending request', { url: `${import.meta.env.VITE_API_BASE_URL}/auth/user` });
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, { credentials: 'include' });
    if (!res.ok) {
      console.log('[AUTH] getUser(): failed', { status: res.status });
      return { user: null as AuthDetails | null };
    }
    const json = await res.json();
    console.log('[AUTH] getUser(): success', { userId: json?.user?.id });
    return { user: json.user as AuthDetails };
  } catch {
    console.log('[AUTH] getUser(): exception');
    return { user: null as AuthDetails | null };
  }
}

// Optional: start Google OAuth (backend returns provider URL)
// Usage: const url = await getGoogleOAuthUrl(); window.location.href = url;
export async function getGoogleOAuthUrl() {
  console.log('[AUTH] getGoogleOAuthUrl(): sending request', { url: `${import.meta.env.VITE_API_BASE_URL}/auth/oauth/google/start` });
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/oauth/google/start`, { credentials: 'include' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Could not start Google OAuth');
  console.log('[AUTH] getGoogleOAuthUrl(): success', { redirectTo: json?.url });
  return json.url as string;
}
