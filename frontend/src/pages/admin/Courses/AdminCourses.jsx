import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function AdminCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/courses/");
      setCourses(res.data || []);
    } catch (err) {
      console.log("Courses fetch error:", err?.response?.data || err);
      alert("❌ Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Delete course
  const deleteCourse = async (courseId) => {
    const ok = window.confirm("Are you sure you want to delete this course?");
    if (!ok) return;

    try {
      await api.delete(`/admin/courses/${courseId}/`);
      alert("✅ Course deleted!");
      fetchCourses();
    } catch (err) {
      console.log("Delete error:", err?.response?.data || err);
      alert("❌ Failed to delete course");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ HEADER */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>📚 Admin Courses</h2>
            <p style={styles.subtitle}>
              Manage your courses (Add / Edit / Delete)
            </p>
          </div>

          <div style={styles.headerBtns}>
            <button
              style={styles.addBtn}
              onClick={() => navigate("/admin/courses/add")}
            >
              ➕ Add Course
            </button>

            {/* ✅ WORKING REFRESH */}
            <button style={styles.refreshBtn} onClick={fetchCourses}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* ✅ BODY */}
        {loading ? (
          <p style={styles.loadingText}>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p style={styles.emptyText}>No courses found.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, width: "320px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} style={styles.tr}>
                    <td style={styles.td}>{course.id}</td>

                    <td style={styles.tdStrong}>{course.title}</td>

                    <td style={styles.td}>
                      {course.description?.length > 60
                        ? course.description.slice(0, 60) + "..."
                        : course.description || "—"}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        {/* ✅ Modules (Quiz is inside module) */}
                        <button
                          style={styles.moduleBtn}
                          onClick={() =>
                            navigate(`/admin/courses/${course.id}/modules`)
                          }
                        >
                          📦 Modules
                        </button>

                        <button
                          style={styles.editBtn}
                          onClick={() =>
                            navigate(`/admin/courses/${course.id}/edit`)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteCourse(course.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>

                      {/* ✅ extra note */}
                      <p style={styles.smallNote}>
                        📝 Quiz is inside <b>Modules</b> → open a module → Quiz
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={styles.note}>
          ✅ Tip: Click <b>Modules</b> to manage modules inside that course.
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
    minWidth: "900px",
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

  moduleBtn: {
    border: "none",
    padding: "9px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#3b82f6",
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

  smallNote: {
    marginTop: "8px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748b",
  },
};
