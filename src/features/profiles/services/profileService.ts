import { ProfileDetails } from '../profiles.types';

// Helper to parse JSON and handle errors
const j = async (res: Response) => {
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error || 'Request failed');
  return body;
};

// Helper to build fetch options with auth
const opts = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: body ? JSON.stringify(body) : undefined,
});

// GET /user/profile/:userId
export async function getProfileDetailsViaID(userId: string): Promise<ProfileDetails | null> {
  try {
    const o = opts('GET');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile/${userId}`, o);
    const body = (await j(res)) as { data: ProfileDetails };
    return body.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}