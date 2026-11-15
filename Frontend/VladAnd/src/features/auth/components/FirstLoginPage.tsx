import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import './auth.css';

export function FirstLoginPage() {
  const navigate = useNavigate();
  const { completeInitialPasswordChange } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please complete all fields.'); return;
    }
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.'); return;
    }
    if (newPassword.length < 12) {
      setError('The new password must be at least 12 characters long.'); return;
    }
    if (currentPassword === newPassword) {
      setError('Your new password must differ from the current password.'); return;
    }
    inFlight.current = true;
    setSubmitting(true);
    try {
      await completeInitialPasswordChange(currentPassword, newPassword);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setSuccess(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to change the password.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Change your initial password</h1>
        <p>You must set a new password before continuing.</p>
        {success ? (
          <div role="status">
            <p>Your password was changed successfully.</p>
            <button type="button" onClick={() => navigate('/dashboard', { replace: true })}>
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="current-password">Current password</label>
            <input
              id="current-password" type="password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password" required
            />
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password" type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password" required
            />
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password" required
            />
            {error && <p className="error" role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Change password'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
