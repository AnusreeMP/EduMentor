import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function AdminModules() {
  const navigate = useNavigate();
  const { courseId } = useParams(); // ✅ IMPORTANT (from route)

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch modules for this course
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/courses/${courseId}/modules/`);
      setModules(res.data || []);
    } catch (err) {
      console.log("Modules fetch error:", err?.response?.data || err);
      alert("❌ Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  // ✅ Delete module
  const handleDelete = async (moduleId) => {
    const ok = window.confirm("Are you sure you want to delete this module?");
    if (!ok) return;

    try {
      await api.delete(`/admin/modules/${moduleId}/`);
      alert("✅ Module deleted!");
      fetchModules();
    } catch (err) {
      console.log("Delete module error:", err?.response?.data || err);
      alert("❌ Failed to delete module");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ HEADER */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>📦 Modules</h2>
            <p style={styles.subtitle}>
              Managing modules of Course ID: <b>{courseId}</b>
            </p>
          </div>

          <div style={styles.headerBtns}>
            {/* ✅ BACK */}
            <button
              style={styles.backBtn}
              onClick={() => navigate("/admin/courses")}
            >
              ← Back
            </button>

            {/* ✅ ADD */}
            <button
              style={styles.addBtn}
              onClick={() => navigate(`/admin/courses/${courseId}/modules/add`)}
            >
              ➕ Add Module
            </button>

            {/* ✅ REFRESH */}
            <button style={styles.refreshBtn} onClick={fetchModules}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* ✅ BODY */}
        {loading ? (
          <p style={styles.loadingText}>Loading modules...</p>
        ) : modules.length === 0 ? (
          <p style={styles.emptyText}>No modules found for this course.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Order</th>
                  <th style={styles.th}>Title</th>
                  <th style={{ ...styles.th, width: "420px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {modules.map((m) => (
                  <tr key={m.id} style={styles.tr}>
                    <td style={styles.td}>{m.id}</td>
                    <td style={styles.td}>{m.order}</td>
                    <td style={styles.tdStrong}>{m.title}</td>

                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        {/* ✅ QUIZ (MODULE BASED) */}
                        <button
                          style={styles.quizBtn}
                          onClick={() =>
                            navigate(
                              `/admin/courses/${courseId}/modules/${m.id}/quiz`
                            )
                          }
                        >
                          📝 Quiz
                        </button>

                        {/* ✅ LESSONS */}
                        <button
                          style={styles.lessonBtn}
                          onClick={() =>
                            navigate(
                              `/admin/courses/${courseId}/modules/${m.id}/lessons`
                            )
                          }
                        >
                          📘 Lessons
                        </button>

                        {/* ✅ EDIT */}
                        <button
                          style={styles.editBtn}
                          onClick={() => navigate(`/admin/modules/${m.id}/edit`)}
                        >
                          ✏️ Edit
                        </button>

                        {/* ✅ DELETE */}
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(m.id)}
                        >
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

        <p style={styles.note}>
          ✅ Tip: Use <b>Quiz</b> to add questions and <b>Lessons</b> to manage
          module lessons.
        </p>
      </div>
    </div>
  );
}

/* ✅ Styles */
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
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "16px",
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

  addBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#16a34a",
    color: "white",
    boxShadow: "0 16px 30px rgba(22,163,74,0.18)",
  },

  refreshBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#0ea5e9",
    color: "white",
    boxShadow: "0 16px 30px rgba(14,165,233,0.18)",
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
    minWidth: "950px",
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
  },

  actionRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  quizBtn: {
    border: "none",
    padding: "9px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#9333ea",
    color: "white",
  },

  lessonBtn: {
    border: "none",
    padding: "9px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#f59e0b",
    color: "white",
  },

  editBtn: {
    border: "none",
    padding: "9px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#4f46e5",
    color: "white",
  },

  deleteBtn: {
    border: "none",
    padding: "9px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
  },

  loadingText: {
    fontWeight: 900,
    color: "#475569",
  },

  emptyText: {
    fontWeight: 800,
    color: "#64748b",
  },

  note: {
    marginTop: "12px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#64748b",
  },
};
