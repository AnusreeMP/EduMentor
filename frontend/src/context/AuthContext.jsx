import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    access: localStorage.getItem("access"),
    isAuthenticated: !!localStorage.getItem("access"),
    loading: true,
  });

  // Run once on app load
  useEffect(() => {
    if (auth.access) {
      setAuth(prev => ({ ...prev, isAuthenticated: true, loading: false }));
    } else {
      setAuth(prev => ({ ...prev, isAuthenticated: false, loading: false }));
    }
  }, []);

  // 🔑 LOGIN
  const login = async (username, password) => {
    const res = await api.post("/login/", { username, password });
    localStorage.setItem("access", res.data.access);

    setAuth({
      access: res.data.access,
      isAuthenticated: true,
      loading: false,
    });
  };

  // 🔓 LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    setAuth({
      access: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook (professional pattern)
export const useAuth = () => useContext(AuthContext);
