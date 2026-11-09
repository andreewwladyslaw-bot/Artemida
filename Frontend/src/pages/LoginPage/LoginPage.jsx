import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import { ArrowRightIcon, BookIcon, MailIcon } from '../../components/ui/icons.jsx';
import './LoginPage.css';

/**
 * FE-001 Login Page (DEV-01..04).
 *
 * Props (for DEV-05..07, which connect the form to POST /auth/login):
 *  - onSubmit({ login, password }): called only when validation passes
 *  - isSubmitting: shows the loading state and blocks repeated submits
 *  - formError: message for a failed login (wrong credentials, 429, 5xx, network)
 */
export default function LoginPage({ onSubmit, isSubmitting = false, formError = '' }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  function validate() {
    const next = {};
    // Login: emptiness check only; the value itself is not changed.
    if (login.trim() === '') next.login = 'Enter your login.';
    // Password: required. It is never trimmed or modified.
    if (password === '') next.password = 'Enter your password.';
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const next = validate();
    setErrors(next);

    if (next.login) {
      loginRef.current?.focus();
      return;
    }
    if (next.password) {
      passwordRef.current?.focus();
      return;
    }

    if (onSubmit) onSubmit({ login, password });
  }

  function handleLoginChange(event) {
    setLogin(event.target.value);
    if (errors.login) setErrors((prev) => ({ ...prev, login: undefined }));
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  }

  return (
    <main className="login">
      <aside className="login__brand">
        <div className="login__logo">
          <span className="login__logo-mark">
            <BookIcon />
          </span>
          <span className="login__logo-name">ARTEMIDA</span>
        </div>

        <div className="login__hero">
          <p className="login__tagline">
            <span className="login__tagline-line" aria-hidden="true" />
            A little more focus. A lot more possible.
          </p>
          <h1 className="login__headline">
            Your school day.
            <br />
            <span className="login__headline-accent">All in one place.</span>
          </h1>
        </div>

        <p className="login__about">
          Less time keeping track. More time moving forward. Your assignments, conversations and
          next big ideas start here.
        </p>
      </aside>

      <section className="login__panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <header className="login__header">
            <p className="login__eyebrow">Welcome to your workspace</p>
            <h2 className="login__title">Good to see you again.</h2>
            <p className="login__subtitle">
              Sign in with your school account to pick up where you left off.
            </p>
          </header>

          {formError && (
            <p className="login__form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="login__fields">
            <Input
              ref={loginRef}
              label="Login"
              name="login"
              type="text"
              icon={<MailIcon />}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={login}
              onChange={handleLoginChange}
              error={errors.login}
            />

            <div className="login__password">
              <PasswordInput
                ref={passwordRef}
                label="Password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
              />
              <Link className="login__recovery" to="/password-recovery">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" block loading={isSubmitting}>
            Sign in
            {!isSubmitting && <ArrowRightIcon width={14} height={14} />}
          </Button>
        </form>
      </section>
    </main>
  );
}
