import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    access: localStorage.getItem("access"),
    isAdmin: localStorage.getItem("isAdmin") === "true",
    isAuthenticated: !!localStorage.getItem("access"),

  });

  
  const login = async (username, password) => {
    const res = await api.post("/login/", { username, password });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("isAdmin", res.data.user.is_admin);

    setAuth({
      access: res.data.access,
      isAdmin: res.data.user.is_admin,
      isAuthenticated: true,
    });

    return res.data.user; // 👈 IMPORTANT
  };


  const logout = () => {
    localStorage.clear();
    setAuth({
      access: null,
      isAdmin: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
