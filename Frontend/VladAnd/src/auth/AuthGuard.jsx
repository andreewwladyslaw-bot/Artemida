import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

export default function AuthGuard({
  allowPasswordChange = false
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Sprawdzanie logowania...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.mustChangePassword && !allowPasswordChange) {
    return <Navigate to="/first-login" replace />;
  }

  return <Outlet />;
}