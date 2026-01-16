import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);

      if (user?.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard"); // ✅ you can change to /courses
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🎓</div>
          <h2 style={styles.title}>
            Welcome back to <span style={{ color: "#4f46e5" }}>EduMentor</span>
          </h2>
          <p style={styles.subtitle}>
            Login to continue your learning journey 🚀
          </p>
        </div>

        {/* ✅ Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* ✅ Form */}
        <div style={styles.form}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrap}>
            <input
              style={{ ...styles.input, paddingRight: "48px", marginBottom: 0 }}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </div>

        {/* ✅ Footer */}
        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "20px",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.18), transparent 45%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  card: {
    width: "100%",
    maxWidth: "440px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(148,163,184,0.35)",
    borderRadius: "22px",
    padding: "26px",
    boxShadow: "0 18px 55px rgba(2,6,23,0.12)",
  },

  header: { textAlign: "center", marginBottom: "18px" },
  logo: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    margin: "0 auto 12px",
    display: "grid",
    placeItems: "center",
    background: "#A7F3D0",
    color: "#064E3B",
    fontSize: "22px",
    fontWeight: 900,
    boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 900,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#64748b",
    fontWeight: 600,
    fontSize: "14px",
  },

  errorBox: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: "14px",
    fontWeight: 700,
    fontSize: "13px",
    marginBottom: "14px",
  },

  form: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontWeight: 800, fontSize: "13px", color: "#334155" },
  input: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontWeight: 600,
    fontSize: "14px",
    background: "white",
    marginBottom: "8px",
  },

  passwordWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
  },

  btn: {
    marginTop: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "12px",
    borderRadius: "14px",
    fontWeight: 900,
    fontSize: "14px",
    boxShadow: "0 16px 30px rgba(79,70,229,0.25)",
  },

  footerText: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 700,
  },
  link: { color: "#4f46e5", fontWeight: 900, textDecoration: "none" },
};
