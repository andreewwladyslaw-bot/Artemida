import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginRequest,
  changeInitialPassword,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((data) => {
        if (active) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function signIn(login, password) {
    const data = await loginRequest(login, password);

    setUser(data.user);
    return data.user;
  }

  async function completeInitialPasswordChange(
    currentPassword,
    newPassword
  ) {
    await changeInitialPassword(currentPassword, newPassword);

    // Potwierdzamy aktualny status użytkownika na serwerze.
    const data = await getCurrentUser();

    if (!data?.user || data.user.mustChangePassword) {
      throw new Error(
        "Nie udało się potwierdzić zmiany hasła na serwerze."
      );
    }

    setUser(data.user);
    return data.user;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        completeInitialPasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth musi być używany wewnątrz AuthProvider");
  }

  return context;
}