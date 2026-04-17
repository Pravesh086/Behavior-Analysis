import { createContext, useContext, useEffect, useState } from "react";

import { getStudentProfileRequest, loginRequest, registerRequest } from "../services/api.js";

const STORAGE_KEY = "mern-auth";

const AuthContext = createContext(null);

const readStoredAuth = () => {
  if (typeof window === "undefined") {
    return {
      token: "",
      user: null,
    };
  }

  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return {
      token: "",
      user: null,
    };
  }

  try {
    return JSON.parse(storedValue);
  } catch (_error) {
    localStorage.removeItem(STORAGE_KEY);
    return {
      token: "",
      user: null,
    };
  }
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (auth.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [auth, isReady]);

  const register = async (payload) => {
    const data = await registerRequest(payload);
    setAuth(data);
    return data;
  };

  const login = async (payload) => {
    const data = await loginRequest(payload);
    setAuth(data);
    return data;
  };

  const logout = () => {
    setAuth({
      token: "",
      user: null,
    });
  };

  const fetchProfile = async () => getStudentProfileRequest(auth.token);

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: Boolean(auth.token),
        isReady,
        register,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};

export { AuthProvider, useAuth };
