import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/admin";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_courses: 0,
    total_users: 0,
    total_enrollments: 0,
  });

  const [recentCourses, setRecentCourses] = useState([]);

  // ✅ NEW: quiz stats for all courses
  const [quizStats, setQuizStats] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // ✅ main admin dashboard data
        const res = await getAdminDashboard();

        setStats({
          total_courses: res.data.total_courses,
          total_users: res.data.total_users,
          total_enrollments: res.data.total_enrollments,
        });

        setRecentCourses(res.data.recent_courses || []);

        // ✅ NEW: Load quiz performance for ALL courses (dynamic)
        // Backend must return array
        // Example: /api/admin/courses/stats/
        const quizStatsRes = await api.get("/admin/courses/stats/");
        setQuizStats(quizStatsRes.data || []);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: "30px", fontWeight: 900 }}>Loading admin dashboard...</p>;
  }

  return (
    <div style={styles.page}>
      {/* ✅ HEADER */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>👑 Admin Dashboard</h2>
          <p style={styles.subText}>
            Manage courses, users, lessons and track performance
          </p>
        </div>
      </div>

      {/* ✅ TOP STATS CARDS */}
      <div style={styles.statsGrid}>
        <GradientCard
          title="Total Courses"
          value={stats.total_courses}
          icon="📚"
          gradient="linear-gradient(135deg, #4f46e5, #7c3aed)"
        />
        <GradientCard
          title="Registered Users"
          value={stats.total_users}
          icon="👨‍🎓"
          gradient="linear-gradient(135deg, #22c55e, #16a34a)"
        />
        <GradientCard
          title="Enrollments"
          value={stats.total_enrollments}
          icon="🔥"
          gradient="linear-gradient(135deg, #f97316, #ea580c)"
        />
      </div>

      {/* ✅ QUIZ PERFORMANCE (ALL COURSES ✅) */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionTop}>
          <h3 style={styles.sectionTitle}>📊 Quiz Performance</h3>
          <span style={styles.badge}>Live</span>
        </div>

        {quizStats.length === 0 ? (
          <p style={styles.emptyText}>No quiz attempts found yet.</p>
        ) : (
          <div style={styles.quizGrid}>
            {quizStats.map((c) => (
              <div key={c.course_id} style={styles.quizMiniCard}>
                <div style={styles.quizMiniTop}>
                  <p style={styles.quizCourseTitle}>{c.course_title}</p>
                  <span style={styles.quizIcon}>📝</span>
                </div>

                <div style={styles.quizRow}>
                  <span style={styles.quizLabel}>Attempts</span>
                  <b style={styles.quizValue}>{c.total_attempts || 0}</b>
                </div>

                <div style={styles.quizRow}>
                  <span style={styles.quizLabel}>Passed</span>
                  <b style={{ ...styles.quizValue, color: "#16a34a" }}>
                    {c.passed || 0}
                  </b>
                </div>

                <div style={styles.quizRow}>
                  <span style={styles.quizLabel}>Failed</span>
                  <b style={{ ...styles.quizValue, color: "#dc2626" }}>
                    {c.failed || 0}
                  </b>
                </div>

                <div style={styles.quizPercent}>
                  ✅ Pass % : <b>{c.pass_percentage || 0}%</b>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={styles.smallNote}>
          ✅ This section updates automatically for all courses (Java / Flutter / new courses also).
        </p>
      </div>

      {/* ✅ RECENT COURSES TABLE */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionTop}>
          <h3 style={styles.sectionTitle}>🧾 Recently Added Courses</h3>
          <span style={{ ...styles.badge, background: "#eef2ff", color: "#4f46e5" }}>
            New
          </span>
        </div>

        {recentCourses.length === 0 ? (
          <p style={styles.emptyText}>No courses found</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((course) => (
                  <tr key={course.id} style={styles.tr}>
                    <td style={styles.tdTitle}>{course.title}</td>
                    <td style={styles.td}>
                      {course.description?.length > 80
                        ? course.description.slice(0, 80) + "..."
                        : course.description || "—"}
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

/* ✅ Gradient Card Component */
function GradientCard({ title, value, icon, gradient }) {
  return (
    <div style={{ ...styles.gradientCard, background: gradient }}>
      <div style={styles.cardTopRow}>
        <p style={styles.cardTitle}>{title}</p>
        <span style={styles.cardIcon}>{icon}</span>
      </div>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

/* ✅ Styles */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.16), transparent 45%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  heading: {
    fontSize: "30px",
    fontWeight: "900",
    margin: 0,
    color: "#0f172a",
  },

  subText: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#64748b",
    fontWeight: "600",
    fontSize: "14px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  gradientCard: {
    borderRadius: "18px",
    padding: "18px",
    color: "white",
    boxShadow: "0 18px 40px rgba(2,6,23,0.14)",
    transition: "0.25s ease",
  },

  cardTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    opacity: 0.9,
  },

  cardValue: {
    marginTop: "14px",
    marginBottom: 0,
    fontSize: "32px",
    fontWeight: "900",
    letterSpacing: "0.3px",
  },

  cardIcon: {
    fontSize: "24px",
    background: "rgba(255,255,255,0.18)",
    padding: "10px",
    borderRadius: "14px",
  },

  sectionCard: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 16px 40px rgba(2,6,23,0.10)",
    border: "1px solid rgba(148,163,184,0.25)",
    marginBottom: "20px",
  },

  sectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "900",
    margin: 0,
    color: "#0f172a",
  },

  badge: {
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "900",
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
  },

  smallNote: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "700",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "700",
  },

  tableWrap: {
    overflowX: "auto",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },

  th: {
    textAlign: "left",
    fontSize: "13px",
    color: "#64748b",
    padding: "14px",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: "800",
    background: "#f8fafc",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "14px",
    fontSize: "14px",
    color: "#334155",
    fontWeight: "600",
  },

  tdTitle: {
    padding: "14px",
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "900",
  },

  // ✅ QUIZ STATS GRID (NEW)
  quizGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },

  quizMiniCard: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 26px rgba(2,6,23,0.06)",
  },

  quizMiniTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  quizCourseTitle: {
    margin: 0,
    fontWeight: "900",
    color: "#0f172a",
    fontSize: "15px",
  },

  quizIcon: {
    fontSize: "20px",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "10px",
    borderRadius: "14px",
    fontWeight: "900",
  },

  quizRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },

  quizLabel: {
    fontWeight: "700",
    color: "#64748b",
    fontSize: "13px",
  },

  quizValue: {
    fontWeight: "900",
    color: "#0f172a",
    fontSize: "13px",
  },

  quizPercent: {
    marginTop: "10px",
    fontWeight: "900",
    fontSize: "13px",
    color: "#334155",
    background: "#f8fafc",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
};
