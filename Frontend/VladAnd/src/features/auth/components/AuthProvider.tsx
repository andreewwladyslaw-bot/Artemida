import { useEffect, useRef, useState } from 'react';
import { changeInitialPassword, getCurrentUser, loginRequest } from '../api/authApi';
import { AuthContext } from '../hooks/useAuth';
import type { AuthProviderProps } from '../hooks/useAuth';
import type { AuthUser } from '../types/auth.types';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = useRef(0);

  useEffect(() => {
    let active = true;
    const requestId = ++sessionId.current;
    getCurrentUser()
      .then((result) => {
        if (active && requestId === sessionId.current) setUser(result.user);
      })
      .catch(() => {
        if (active && requestId === sessionId.current) setUser(null);
      })
      .finally(() => {
        if (active && requestId === sessionId.current) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function signIn(login: string, password: string): Promise<AuthUser> {
    const result = await loginRequest({ login, password });
    if (!result.user) throw new Error('Authentication was not confirmed by the server.');
    ++sessionId.current;
    setUser(result.user);
    setLoading(false);
    return result.user;
  }

  async function completeInitialPasswordChange(
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthUser> {
    await changeInitialPassword({ currentPassword, newPassword });
    // A successful POST alone does not prove the server cleared the password-change flag.
    const result = await getCurrentUser();
    if (!result.user || result.user.mustChangePassword) {
      throw new Error('The server did not confirm the password change.');
    }
    ++sessionId.current;
    setUser(result.user);
    return result.user;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, completeInitialPasswordChange }}>
      {children}
    </AuthContext.Provider>
  );
}
