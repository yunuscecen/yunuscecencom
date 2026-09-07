import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import http, { setAccessToken } from "../api/http";

const AuthContext = createContext(null);

let initialSessionPromise = null;

const requestInitialSession = () => {
  if (!initialSessionPromise) {
    initialSessionPromise = http.post("/auth/refresh");
  }

  return initialSessionPromise;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const response = await requestInitialSession();

        if (!active) {
          return;
        }

        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      } catch {
        if (active) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    const handleExpiredSession = () => {
      setAccessToken(null);
      setUser(null);
      setAuthLoading(false);
    };

    window.addEventListener(
      "auth:expired",
      handleExpiredSession
    );

    restoreSession();

    return () => {
      active = false;

      window.removeEventListener(
        "auth:expired",
        handleExpiredSession
      );
    };
  }, []);

  const login = async (credentials) => {
    const response = await http.post("/auth/login", credentials);

    setAccessToken(response.data.accessToken);
    setUser(response.data.user);

    return response.data.user;
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
    } finally {
      initialSessionPromise = null;
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth, AuthProvider içerisinde kullanılmalıdır."
    );
  }

  return context;
};