import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function FirstLoginPage() {
  const navigate = useNavigate();
  const { completeInitialPasswordChange } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Wypełnij wszystkie pola.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Nowe hasła nie są identyczne.");
      return;
    }

    if (newPassword.length < 12) {
      setError("Hasło musi mieć co najmniej 12 znaków.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("Nowe hasło musi różnić się od obecnego.");
      return;
    }

    setLoading(true);

    try {
      await completeInitialPasswordChange(
        currentPassword,
        newPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);

    } catch (err) {
      setError(err.message || "Nie udało się zmienić hasła.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Pierwsza zmiana hasła</h1>

        <p>
          Aby kontynuować, musisz
          ustawić nowe hasło.
        </p>

        {success ? (
          <div role="status">
            <p>Hasło zostało zmienione!</p>

            <button
              type="button"
              onClick={() => navigate("/dashboard", {
                replace: true,
              })}
            >
              Przejdź do panelu głównego
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="current-password">
              Aktualne hasło
            </label>

            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />

            <label htmlFor="new-password">
              Nowe hasło
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirm-password">
              Potwierdź nowe hasło
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              required
            />

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Zapisywanie..." : "Zmień hasło"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}