import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const { dark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  console.log("Dark mode value:", dark);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 THEME COLORS (MATCH LANDING PAGE)
  const theme = {
    bg: dark ? "#111827" : "#ffffff",
    border: dark ? "#374151" : "#e5e7eb",
    text: dark ? "#e5e7eb" : "#111827",
    link: dark ? "#d1d5db" : "#374151",
    hover: dark ? "#4f46e5" : "#4f46e5",
    logout: "#ef4444",
  };

  return (
    <nav
      style={{
        ...styles.nav,
        background: theme.bg,
        borderBottom: `1px solid ${theme.border}`,
        color: theme.text,
      }}
    >
      {/* LEFT */}
      <Link to="/" style={{ ...styles.brand, color: theme.text }}>
        EduMentor
      </Link>

      {/* RIGHT */}
      <div style={styles.right}>
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          style={{
            border: "1px solid",
            background: "transparent",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>


        {auth.isAuthenticated ? (
          <>
            <Link to="/courses" style={{ ...styles.link, color: theme.link }}>
              Courses
            </Link>

            <button
              onClick={handleLogout}
              style={{ ...styles.logout, background: theme.logout }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ ...styles.link, color: theme.link }}>
              Login
            </Link>
            <Link to="/register" style={{ ...styles.link, color: theme.link }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

/* ================= STYLES ================= */

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
  brand: {
    fontSize: "22px",
    fontWeight: "700",
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  link: {
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
  },
  logout: {
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  themeBtn: {
    border: "1px solid #6b7280",
    background: "transparent",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
