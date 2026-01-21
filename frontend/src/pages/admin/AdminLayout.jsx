import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      {/* ===== SIDEBAR ===== */}
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>EduMentor</h2>

          <nav style={styles.nav}>
            <NavLink
              to="/admin/dashboard"
              style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/courses"
              style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Courses
            </NavLink>

            <NavLink
              to="/admin/courses"
              style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Modules
            </NavLink>

            <NavLink
              to="/admin/users"
              style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Users
            </NavLink>

            <NavLink
              to="/admin/lessons"
              style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Lessons
            </NavLink>
          </nav>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <p style={styles.topbarText}>Admin Panel</p>
        </div>

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f3f4f6",
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "32px",
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    color: "#d1d5db",
    textDecoration: "none",
    fontSize: "15px",
    padding: "10px 14px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
  },
  activeLink: {
    background: "#1f2937",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "600",
  },
  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  /* ✅ FIXED KEY NAME */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  topbar: {
    height: "60px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    padding: "0 30px",
  },
  topbarText: {
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    padding: "30px",
    flex: 1,
  },
};
