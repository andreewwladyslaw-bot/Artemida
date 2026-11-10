import { Routes, Route, Navigate } from "react-router";

import AuthGuard from "./auth/AuthGuard";
import LoginPage from "./pages/LoginPage";
import FirstLoginPage from "./pages/FirstLoginPage";

import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route path="/login" element={<LoginPage />} />
      <Route
  path="/forgot-password"
  element={<ForgotPasswordPage />}
/>

      <Route element={<AuthGuard allowPasswordChange />}>
        <Route
          path="/first-login"
          element={<FirstLoginPage />}
        />
      </Route>

      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<h1>Czat</h1>} />
        <Route path="/calendar" element={<h1>Kalendarz</h1>} />
        <Route path="/profile" element={<h1>Profil</h1>} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}