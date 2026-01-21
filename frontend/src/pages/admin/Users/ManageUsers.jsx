import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users/");
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Block / Unblock user
  const toggleBlock = async (user) => {
    if (user.is_superuser) {
      alert("⚠️ Superuser cannot be blocked");
      return;
    }

    try {
      await api.patch(`/admin/users/${user.id}/toggle-active/`);
      fetchUsers();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to update user status");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ Header */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>👥 Manage Users</h2>
            <p style={styles.subtitle}>
              Block / Unblock users and manage account status
            </p>
          </div>

          <div style={styles.headerBtns}>
            <button style={styles.backBtn} onClick={() => navigate("/admin")}>
              ← Back
            </button>

            <button style={styles.refreshBtn} onClick={fetchUsers}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* ✅ Loading */}
        {loading ? (
          <p style={styles.loadingText}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={styles.emptyText}>No users found.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, width: "170px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>{user.id}</td>

                    <td style={styles.tdStrong}>
                      {user.username}
                      {user.is_superuser && (
                        <span style={styles.superBadge}>SUPER</span>
                      )}
                    </td>

                    <td style={styles.td}>{user.email || "—"}</td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background: user.is_superuser ? "#fee2e2" : "#eef2ff",
                          color: user.is_superuser ? "#b91c1c" : "#4f46e5",
                        }}
                      >
                        {user.is_superuser ? "ADMIN" : "USER"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {user.is_active ? (
                        <span style={{ ...styles.statusBadge, ...styles.active }}>
                          ✅ Active
                        </span>
                      ) : (
                        <span
                          style={{ ...styles.statusBadge, ...styles.blocked }}
                        >
                          ⛔ Blocked
                        </span>
                      )}
                    </td>

                    <td style={styles.td}>
                      {!user.is_superuser ? (
                        <button
                          onClick={() => toggleBlock(user)}
                          style={
                            user.is_active ? styles.blockBtn : styles.unblockBtn
                          }
                        >
                          {user.is_active ? "Block" : "Unblock"}
                        </button>
                      ) : (
                        <span style={styles.lockedText}>Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ✅ Styles (same look as Lessons) */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "26px",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.16), transparent 50%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  card: {
    width: "100%",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },

  headerBtns: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 900,
    color: "#0f172a",
  },

  subtitle: {
    margin: 0,
    marginTop: "6px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#64748b",
  },

  backBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#eef2ff",
    color: "#4f46e5",
  },

  refreshBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#0f172a",
    color: "white",
  },

  tableWrap: {
    overflowX: "auto",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    background: "white",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    fontSize: "13px",
    fontWeight: 900,
    color: "#334155",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "14px",
    fontWeight: 700,
    color: "#334155",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  tdStrong: {
    padding: "14px",
    fontWeight: 900,
    color: "#0f172a",
    fontSize: "13px",
    verticalAlign: "middle",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "12px",
    border: "1px solid rgba(148,163,184,0.30)",
  },

  superBadge: {
    fontSize: "10px",
    fontWeight: 900,
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid rgba(239,68,68,0.35)",
  },

  statusBadge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "12px",
    border: "1px solid rgba(148,163,184,0.30)",
    display: "inline-block",
  },

  active: {
    background: "#dcfce7",
    color: "#166534",
  },

  blocked: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  blockBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 900,
  },

  unblockBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 900,
    boxShadow: "0 16px 30px rgba(22,163,74,0.18)",
  },

  lockedText: {
    fontWeight: 900,
    color: "#64748b",
  },

  loadingText: {
    fontWeight: 900,
    color: "#475569",
  },

  emptyText: {
    fontWeight: 800,
    color: "#64748b",
  },
};
