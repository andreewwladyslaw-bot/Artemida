
import { Link } from "react-router";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Odzyskiwanie dostępu</h1>

        <p>
          Jeśli nie pamiętasz hasła, skontaktuj się
          z administratorem EduPlatform, aby
          odzyskać dostęp do konta.
        </p>

        <Link to="/login">
          Wróć do logowania
        </Link>
      </section>
    </main>
  );
}
