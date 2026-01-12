import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users/");
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SINGLE Block / Unblock action
  const toggleBlock = async (user) => {
    if (user.is_superuser) {
      alert("Superuser cannot be blocked");
      return;
    }

    try {
      await api.patch(
        `/admin/users/${user.id}/toggle-active/`
      );

      fetchUsers();
    } catch {
      alert("Failed to update user status");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>Manage Users</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th style={{ width: "160px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email || "—"}</td>

              <td>
                {user.is_active ? (
                  <span style={styles.active}>Active</span>
                ) : (
                  <span style={styles.blocked}>Blocked</span>
                )}
              </td>

              <td>
                {!user.is_superuser && (
                  <button
                    onClick={() => toggleBlock(user)}
                    style={
                      user.is_active
                        ? styles.blockBtn
                        : styles.unblockBtn
                    }
                  >
                    {user.is_active ? "Block" : "Unblock"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    background: "#fff",
  },
  active: {
    color: "#16a34a",
    fontWeight: "500",
  },
  blocked: {
    color: "#dc2626",
    fontWeight: "500",
  },
  blockBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  unblockBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
};
