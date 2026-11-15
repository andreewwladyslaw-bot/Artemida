import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/auth.types';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn(login: string, password: string): Promise<AuthUser>;
  completeInitialPasswordChange(currentPassword: string, newPassword: string): Promise<AuthUser>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}

export interface AuthProviderProps { children: ReactNode }
