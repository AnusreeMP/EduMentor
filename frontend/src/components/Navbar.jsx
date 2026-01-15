import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const { dark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const theme = {
    bg: dark ? "#0b1220" : "#ffffff",
    border: dark ? "#1f2937" : "#e5e7eb",
    text: dark ? "#e5e7eb" : "#0f172a",
    link: dark ? "#cbd5e1" : "#334155",
    hoverBg: dark ? "#111827" : "#f1f5f9",
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    danger: "#ef4444",
    dangerHover: "#dc2626",
  };

  const activeLinkStyle = ({ isActive }) => ({
    ...styles.linkBtn,
    background: isActive ? theme.hoverBg : "transparent",
    border: isActive ? `1px solid ${theme.border}` : "1px solid transparent",
    color: theme.link,
  });

  return (
    <nav
      style={{
        ...styles.nav,
        background: theme.bg,
        borderBottom: `1px solid ${theme.border}`,
        color: theme.text,
      }}
    >
      {/* ✅ LEFT: LOGO + BRAND (attached properly) */}
      <Link to="/" style={styles.brandWrap}>
        <div style={{ ...styles.logo, background: "#A7F3D0" }}>
          <GraduationCap size={22} color="#064E3B" />
        </div>

        <div style={styles.brandTextWrap}>
          <span style={{ ...styles.brandName, color: theme.text }}>
            Edu<span style={{ color: theme.primary }}>Mentor</span>
          </span>
          <span style={{ ...styles.brandTag, color: theme.link }}>
            Learn • Practice • Grow
          </span>
        </div>
      </Link>

      {/* ✅ RIGHT SIDE */}
      <div style={styles.right}>
        {/* ✅ Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            ...styles.themeBtn,
            border: `1px solid ${theme.border}`,
            color: theme.link,
            background: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = theme.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* ✅ Nav Links */}
        <NavLink to="/" style={activeLinkStyle}>
          Home
        </NavLink>

        <NavLink to="/courses" style={activeLinkStyle}>
          Courses
        </NavLink>

        {/* ✅ Auth Buttons */}
        {auth.isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            style={{
              ...styles.logoutBtn,
              background: theme.danger,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = theme.dangerHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = theme.danger)
            }
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                ...styles.outlineBtn,
                border: `1px solid ${theme.border}`,
                color: theme.link,
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Sign In
            </Link>

            <Link
              to="/register"
              style={{
                ...styles.primaryBtn,
                background: theme.primary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = theme.primaryHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = theme.primary)
              }
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

/* ✅ CLEAN PROFESSIONAL STYLES (NO DUPLICATES) */
const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },

  logo: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
    flexShrink: 0,
  },

  brandTextWrap: {
    display: "flex",
    flexDirection: "column",
    lineHeight: "1.1",
  },

  brandName: {
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  },

  brandTag: {
    fontSize: "12px",
    fontWeight: "500",
    marginTop: "3px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  linkBtn: {
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 14px",
    borderRadius: "12px",
    transition: "0.2s",
  },

  themeBtn: {
    padding: "8px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    transition: "0.2s",
  },

  outlineBtn: {
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "13px",
    transition: "0.2s",
  },

  primaryBtn: {
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "13px",
    color: "#fff",
    transition: "0.2s",
    boxShadow: "0 10px 18px rgba(79,70,229,0.25)",
  },

  logoutBtn: {
    border: "none",
    padding: "8px 14px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "13px",
    color: "#fff",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 10px 18px rgba(239,68,68,0.25)",
  },
};
