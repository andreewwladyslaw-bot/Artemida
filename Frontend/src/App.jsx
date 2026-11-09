import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage/PasswordRecoveryPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
