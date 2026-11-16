
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signIn } from './authService';
import { getLoginErrorMessage } from './loginErrors';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const inFlight = useRef(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (inFlight.current) return;

    if (!credentials.login.trim() || !credentials.password.trim()) {
      setError('Login and password are required.');
      return;
    }

    inFlight.current = true;
    setIsLoading(true);
    setError('');

    try {
      const response = await signIn({
        login: credentials.login.trim(),
        password: credentials.password,
      });

      if (typeof response?.mustChangePassword !== 'boolean') {
        throw new Error('Invalid login response');
      }

      const destination = response.mustChangePassword
        ? '/first-login'
        : '/Dashboard';

      navigate(destination, { replace: true });
    } catch (error) {
      setError(getLoginErrorMessage(error));
    } finally {
      inFlight.current = false;
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
        aria-busy={isLoading}
        noValidate
      >
        <h1>Artemida</h1>
        <p>Sign in to your account</p>

        <label htmlFor="login">Login</label>
        <input
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          value={credentials.login}
          onChange={handleChange}
          disabled={isLoading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
          disabled={isLoading}
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
