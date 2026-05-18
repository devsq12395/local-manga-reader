type Err = { message: string };

const opts = (method: string, body?: any): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: body ? JSON.stringify(body) : undefined,
});

export async function setProfileUsername(uid: string, username: string) {
  try {
    console.log('[AUTH] setProfileUsername(): sending request', { uid, username });
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/set-profile/${uid}`, opts('POST', { username }));
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.log('[AUTH] setProfileUsername(): failed', { status: res.status, body: json });
      return { data: null as any, error: { message: json.error || 'Failed to set profile' } as Err };
    }
    console.log('[AUTH] setProfileUsername(): success');
    return { data: json?.data, error: null as any };
  } catch (e: any) {
    console.log('[AUTH] setProfileUsername(): exception', { message: e?.message });
    return { data: null as any, error: { message: e?.message || 'Failed to set profile' } as Err };
  }
}
