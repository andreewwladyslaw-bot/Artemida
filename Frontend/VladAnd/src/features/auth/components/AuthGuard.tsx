import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  allowPasswordChange?: boolean;
}

export function AuthGuard({ allowPasswordChange = false }: AuthGuardProps) {
  const { user, loading } = useAuth();
  if (loading) return <p>Checking authentication...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword && !allowPasswordChange) {
    return <Navigate to="/first-login" replace />;
  }
  return <Outlet />;
}
