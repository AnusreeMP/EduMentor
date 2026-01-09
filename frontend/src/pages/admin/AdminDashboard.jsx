import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/admin";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_courses: 0,
    total_users: 0,
    total_enrollments: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();

        setStats({
          total_courses: res.data.total_courses,
          total_users: res.data.total_users,
          total_enrollments: res.data.total_enrollments,
        });

        setRecentCourses(res.data.recent_courses || []);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading admin dashboard...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>

      {/* ===== STATS ===== */}
      <div style={styles.statsGrid}>
        <StatCard title="Total Courses" value={stats.total_courses} />
        <StatCard title="Registered Users" value={stats.total_users} />
        <StatCard title="Enrollments" value={stats.total_enrollments} />
      </div>

      {/* ===== RECENT COURSES ===== */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recently Added Courses</h3>

        {recentCourses.length === 0 ? (
          <p style={styles.emptyText}>No courses found</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.map(course => (
                <tr key={course.id}>
                  <td style={styles.td}>{course.title}</td>
                  <td style={styles.td}>
                    {course.description || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ===== REUSABLE STAT CARD ===== */
function StatCard({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  container: {
    padding: "32px",
    background: "#f9fafb",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "28px",
    color: "#111827",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "14px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  cardValue: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "14px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "18px",
    color: "#111827",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: "13px",
    color: "#6b7280",
    paddingBottom: "10px",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "14px 0",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
    color: "#111827",
  },
};
