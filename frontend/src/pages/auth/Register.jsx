import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // optional if backend supports
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/register/", {
        username,
        password,
        email, // backend ignore if not used
      });

      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>✨</div>
          <h2 style={styles.title}>
            Create your <span style={{ color: "#4f46e5" }}>EduMentor</span> account
          </h2>
          <p style={styles.subtitle}>Start learning today 💡</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.form}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label style={styles.label}>Email (optional)</label>
          <input
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrap}>
            <input
              style={{ ...styles.input, paddingRight: "48px", marginBottom: 0 }}
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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
            onClick={handleRegister}
            disabled={loading}
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </div>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Sign In
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
      "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 45%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
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
    background: "#22c55e",
    color: "white",
    padding: "12px",
    borderRadius: "14px",
    fontWeight: 900,
    fontSize: "14px",
    boxShadow: "0 16px 30px rgba(34,197,94,0.25)",
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
