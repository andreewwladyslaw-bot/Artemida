import { Link } from 'react-router-dom';

// Placeholder so the "Forgot your password?" link on /login has a target.
// The real page is FE-004 (Password Recovery Request).
export default function PasswordRecoveryPage() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Password recovery</h1>
      <p>This page will be implemented in FE-004.</p>
      <Link to="/login">Back to login</Link>
    </main>
  );
}
