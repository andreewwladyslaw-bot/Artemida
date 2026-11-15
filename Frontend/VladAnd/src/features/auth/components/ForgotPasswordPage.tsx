import { Link } from 'react-router';
import './auth.css';

export function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Recover access</h1>
        <p>If you forgot your password, contact your EduPlatform administrator for help.</p>
        <Link to="/login">Back to Login</Link>
      </section>
    </main>
  );
}
