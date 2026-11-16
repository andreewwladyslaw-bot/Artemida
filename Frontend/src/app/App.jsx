
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from '../features/auth/LoginPage';
import FirstLoginPage from '../pages/FirstLoginPage';
import DashboardPage from '../pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/first-login"
          element={<FirstLoginPage />}
        />

        <Route
          path="/Dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
