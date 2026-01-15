import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");
    const user = localStorage.getItem("user");

    if (access && user) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(user),
      });
    }

    setLoadingAuth(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/login/", {
      username: username.trim(),
      password,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setAuth({
      isAuthenticated: true,
      user: res.data.user,
    });

    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setAuth({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
