import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function Lessons() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons/");
      setLessons(res.data || []);
    } catch (err) {
      console.log("Lessons fetch error:", err);
      alert("❌ Unable to load lessons (check login / token / API)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDelete = async (lessonId) => {
    const ok = window.confirm("Are you sure you want to delete this lesson?");
    if (!ok) return;

    try {
      await api.delete(`/lessons/${lessonId}/delete/`);
      alert("✅ Lesson deleted!");
      fetchLessons();
    } catch (err) {
      console.log("Delete error:", err);
      alert("❌ Delete failed (check backend delete API)");
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading lessons...</p>;

  return (
    <div style={styles.page}>
      {/* ✅ Top Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📚 All Lessons</h2>
          <p style={styles.subTitle}>Manage lessons with module details & actions</p>
        </div>

        <div style={styles.headerBtns}>
          <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>
            ← Back
          </button>

          <button style={styles.addBtn} onClick={() => navigate("/admin/lessons/add")}>
            ➕ Add Lesson
          </button>
        </div>
      </div>

      {/* ✅ Table Card */}
      <div style={styles.card}>
        {lessons.length === 0 ? (
          <p style={{ color: "#64748b", fontWeight: 700 }}>No lessons found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Lesson ID</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Module ID</th>
                  <th style={styles.th}>Module Name</th>
                  <th style={styles.th}>Order</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {lessons.map((l) => (
                  <tr key={l.id} style={styles.tr}>
                    <td style={styles.td}>{l.id}</td>
                    <td style={{ ...styles.td, fontWeight: 900 }}>{l.title}</td>

                    {/* ✅ Module ID */}
                    <td style={styles.td}>{l.module_id ?? "—"}</td>

                    {/* ✅ Module Title */}
                    <td style={styles.td}>
                      {l.module_title ? (
                        <span style={styles.moduleBadge}>{l.module_title}</span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td style={styles.td}>{l.order}</td>

                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        <button
                          style={styles.editBtn}
                          onClick={() => navigate(`/admin/lessons/${l.id}/edit`)}
                        >
                          ✏️ Edit
                        </button>

                        <button style={styles.deleteBtn} onClick={() => handleDelete(l.id)}>
                          🗑 Delete
                        </button>
                      </div>
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

/* ✅ Styles */
const styles = {
  page: {
    padding: "26px",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.20), transparent 50%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "18px",
    background: "rgba(255,255,255,0.9)",
    borderRadius: "18px",
    padding: "16px 18px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
  },

  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 900,
    color: "#0f172a",
  },

  subTitle: {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "13px",
    color: "#64748b",
    fontWeight: 700,
  },

  headerBtns: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  backBtn: {
    border: "none",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },

  addBtn: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(22,163,74,0.20)",
  },

  card: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    color: "#475569",
    fontWeight: 900,
    fontSize: "13px",
    borderBottom: "2px solid #e2e8f0",
    background: "#f8fafc",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: 700,
    color: "#0f172a",
    fontSize: "14px",
  },

  tr: {
    background: "white",
  },

  moduleBadge: {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "12px",
    display: "inline-block",
  },

  actionRow: {
    display: "flex",
    gap: "8px",
  },

  editBtn: {
    border: "none",
    background: "#3b82f6",
    color: "white",
    padding: "8px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
  },

  deleteBtn: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "8px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
  },
};
