import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import './auth.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError('');
    if (!login.trim()) { setError('Please enter your login.'); return; }
    // The entered password is never trimmed, lowercased, or normalized.
    if (!password) { setError('Please enter your password.'); return; }
    inFlight.current = true;
    setSubmitting(true);
    try {
      const currentUser = await signIn(login, password);
      navigate(currentUser.mustChangePassword ? '/first-login' : '/dashboard', { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign-in failed.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (loading) return <p>Checking authentication...</p>;
  if (user) {
    return <Navigate to={user.mustChangePassword ? '/first-login' : '/dashboard'} replace />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Login</h1>
        <p>Sign in to EduPlatform</p>
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={submitting}
        >
          <label htmlFor="login">Login</label>
          <input
            id="login" name="login" type="text" placeholder="Enter your login"
            value={login} onChange={(e) => { setLogin(e.target.value); setError(''); }}
            autoComplete="username" required
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password" name="password" type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password" value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password" required
            />
            <button
              type="button" className="password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <p className="error" role="alert">{error}</p>}
          <button className="login-button" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
          <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>
        </form>
      </section>
    </main>
  );
}
