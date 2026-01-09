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
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/`, { role });
      fetchUsers();
    } catch {
      alert("Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${userId}/`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      alert("Failed to delete user");
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
            <th>Role</th>
            <th style={{ width: "220px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role === "student" ? (
                  <button
                    onClick={() => updateRole(user.id, "admin")}
                    style={styles.promoteBtn}
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => updateRole(user.id, "student")}
                    style={styles.demoteBtn}
                  >
                    Make Student
                  </button>
                )}

                <button
                  onClick={() => deleteUser(user.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
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
  promoteBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
  },
  demoteBtn: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
