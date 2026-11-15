import { Navigate, Route, Routes } from 'react-router';
import {
  AuthGuard, FirstLoginPage, ForgotPasswordPage, LoginPage,
} from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { SectionPlaceholder } from '@/shared/ui/SectionPlaceholder';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';

/** app/ composes features; it does not implement authentication business logic. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<AuthGuard allowPasswordChange />}>
        <Route path="/first-login" element={<FirstLoginPage />} />
      </Route>
      <Route element={<AuthGuard />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<SectionPlaceholder title="Chat" />} />
          <Route path="/calendar" element={<SectionPlaceholder title="Calendar" />} />
          <Route path="/profile" element={<SectionPlaceholder title="Profile" />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
