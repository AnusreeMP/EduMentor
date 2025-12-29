import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      {/* Left side */}
      <div style={styles.left}>
        <Link to="/courses" style={styles.brand}>
          EduMentor
        </Link>
      </div>

      {/* Right side */}
      <div style={styles.right}>
        {auth.isAuthenticated ? (
          <>
            <Link to="/courses" style={styles.link}>Courses</Link>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#1f2937",
    color: "#fff",
  },
  brand: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  right: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  logout: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
