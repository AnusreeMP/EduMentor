import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

/* ✅ SAME IMAGE LOGIC AS COURSES.JSX */
function getCourseImage(course) {
  const title = (course?.title || "").toLowerCase();

  const djangoImg =
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=60";
  const pythonImg =
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&auto=format&fit=crop&q=60";
  const defaultImg =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=60";

  return (
    course?.thumbnail ||
    (title.includes("django")
      ? djangoImg
      : title.includes("python")
      ? pythonImg
      : defaultImg)
  );
}

export default function StudentDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/my-enrollments/");
        setEnrollments(res.data || []);
      } catch (err) {
        console.log("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const total = enrollments.length;
    const completed = enrollments.filter((e) => e.progress >= 100).length;
    const inProgress = enrollments.filter(
      (e) => e.progress > 0 && e.progress < 100
    ).length;

    return { total, completed, inProgress };
  }, [enrollments]);

  if (loading) return <p style={{ padding: "30px" }}>Loading Dashboard...</p>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Welcome,{" "}
          <span style={{ color: "#4f46e5" }}>{auth?.user?.username}</span> 👋
        </h1>
        <p style={styles.subTitle}>
          Track your progress and continue where you left off.
        </p>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <StatCard label="Enrolled Courses" value={stats.total} icon="📚" />
        <StatCard label="In Progress" value={stats.inProgress} icon="⏳" />
        <StatCard label="Completed" value={stats.completed} icon="✅" />
      </div>

      {/* My Learning */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>My Learning</h2>
        <button style={styles.primaryBtn} onClick={() => navigate("/courses")}>
          Browse Courses →
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>You are not enrolled in any course yet.</p>
          <button style={styles.primaryBtn} onClick={() => navigate("/courses")}>
            Explore Courses →
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {enrollments.map((en) => (
            <CourseProgressCard key={en.course.id} enrollment={en} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ✅ Components */
function StatCard({ label, value, icon }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <span style={{ fontSize: "22px" }}>{icon}</span>
        <p style={styles.statValue}>{value}</p>
      </div>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

function CourseProgressCard({ enrollment }) {
  const navigate = useNavigate();
  const course = enrollment.course;
  const progress = enrollment.progress ?? 0;

  const handleContinue = () => {
    if (enrollment.last_lesson_id) {
      navigate(`/lessons/${enrollment.last_lesson_id}`);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/courses/${course.id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
    >
      <img
        src={getCourseImage(course)}
        alt={course.title}
        style={styles.cardImg}
      />

      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{course.title}</h3>
        <p style={styles.cardDesc}>
          {(course.description || "No description").slice(0, 65)}...
        </p>

        <div style={styles.progressWrap}>
          <div style={styles.progressRow}>
            <span style={styles.progressText}>Progress</span>
            <span style={styles.progressText}>{progress}%</span>
          </div>

          <div style={styles.progressBarBg}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <button
          style={styles.continueBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleContinue();
          }}
        >
          Continue Learning →
        </button>
      </div>
    </div>
  );
}

/* ✅ Styles (Fixed Card Size + Premium Minimal UI) */
const styles = {
  page: {
    padding: "30px",
    background: "#f5f9ff",
    minHeight: "100vh",
  },

  header: { marginBottom: "18px" },
  title: {
    fontSize: "30px",
    fontWeight: "900",
    margin: 0,
    color: "#0f172a",
  },
  subTitle: { marginTop: "6px", color: "#64748b", fontSize: "15px" },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginTop: "18px",
    marginBottom: "24px",
  },

  statCard: {
    background: "white",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 24px rgba(2,6,23,0.06)",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "900",
    margin: 0,
    color: "#0f172a",
  },
  statLabel: {
    marginTop: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#64748b",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "900",
    color: "#0f172a",
    margin: 0,
  },

  primaryBtn: {
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(79,70,229,0.20)",
  },

  empty: {
    padding: "26px",
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 24px rgba(2,6,23,0.06)",
    textAlign: "center",
    maxWidth: "520px",
  },
  emptyText: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "12px",
  },

  /* ✅ FIX GRID SIZE */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 320px))",
    gap: "16px",
    justifyContent: "start",
  },

  /* ✅ FIX CARD SIZE */
  card: {
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 26px rgba(2,6,23,0.08)",
    transition: "0.2s ease",
    width: "100%",
    maxWidth: "320px",
  },

  /* ✅ SMALLER IMAGE */
  cardImg: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    display: "block",
  },

  cardBody: { padding: "14px 14px 16px" },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "900",
    margin: "0 0 6px 0",
    color: "#0f172a",
  },

  cardDesc: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "12px",
    lineHeight: 1.5,
  },

  progressWrap: { marginBottom: "12px" },

  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12.5px",
    fontWeight: "800",
    color: "#334155",
    marginBottom: "6px",
  },

  progressText: { color: "#334155" },

  progressBarBg: {
    width: "100%",
    height: "9px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    background: "#4f46e5",
    borderRadius: "999px",
  },

  continueBtn: {
    width: "100%",
    border: "none",
    background: "#0f172a",
    color: "white",
    padding: "10px",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
  },
};
