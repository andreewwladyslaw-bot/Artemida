// Public contract of the auth feature. Other modules must not deep-import its internals.
export { AuthProvider } from './components/AuthProvider';
export { AuthGuard } from './components/AuthGuard';
export { LoginPage } from './components/LoginPage';
export { FirstLoginPage } from './components/FirstLoginPage';
export { ForgotPasswordPage } from './components/ForgotPasswordPage';
export { useAuth } from './hooks/useAuth';
export type { AuthUser, LoginCredentials } from './types/auth.types';
