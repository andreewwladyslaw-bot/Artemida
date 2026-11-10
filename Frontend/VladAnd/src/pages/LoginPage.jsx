
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();

  // Dane formularza
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // Stan interfejsu
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Wysyłanie formularza
  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setError("");

    // Walidacja wymaganych pól
    if (!login.trim()) {
      setError("Wprowadź login.");
      return;
    }

    if (password.length === 0) {
      setError("Wprowadź hasło.");
      return;
    }

    setSubmitting(true);

    try {
      // Logowanie za pomocą AuthContext
      const currentUser = await signIn(login, password);

      // Sprawdzamy, czy wymagana jest zmiana hasła
      if (currentUser.mustChangePassword) {
        navigate("/first-login", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }

    } catch (err) {
      setError(
        err.message || "Wystąpił błąd logowania."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Czekamy na sprawdzenie bieżącej sesji
  if (loading) {
    return <p>Sprawdzanie logowania...</p>;
  }

  // Użytkownik jest już zalogowany
  if (user) {
    return (
      <Navigate
        to={
          user.mustChangePassword
            ? "/first-login"
            : "/dashboard"
        }
        replace
      />
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <h1>Logowanie</h1>
        <p>Zaloguj się do EduPlatform</p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Login */}
          <label htmlFor="login">
            Login
          </label>

          <input
            id="login"
            name="login"
            type="text"
            placeholder="Wprowadź login"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              setError("");
            }}
            autoComplete="username"
            required
          />

          {/* Hasło */}
          <label htmlFor="password">
            Hasło
          </label>

          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Wprowadź hasło"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              aria-label={
                showPassword
                  ? "Ukryj hasło"
                  : "Pokaż hasło"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ukryj" : "Pokaż"}
            </button>
          </div>

          {/* Komunikat o błędzie */}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {/* Przycisk logowania */}
          <button
            type="submit"
            className="login-button"
            disabled={submitting}
          >
            {submitting ? "Logowanie..." : "Zaloguj się"}
          </button>

          {/* Odzyskiwanie dostępu */}
          <Link
            to="/forgot-password"
            className="forgot-password"
          >
            Nie pamiętasz hasła?
          </Link>

        </form>
      </section>
    </main>
  );
}
