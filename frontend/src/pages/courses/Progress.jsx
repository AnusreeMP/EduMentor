import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Progress() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/courses/${courseId}/progress/`);
        setProgress(res.data);
      } catch (err) {
        console.error(err);
        setError("Progress not available yet");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  // ✅ OPEN FRONTEND CERTIFICATE PAGE (NO BACKEND PDF)
  const openCertificate = () => {
    navigate(`/courses/${courseId}/certificate`);
  };

  if (loading) return <p style={{ padding: 30 }}>Loading progress...</p>;
  if (error) return <p style={{ padding: 30, color: "red" }}>{error}</p>;
  if (!progress) return <p style={{ padding: 30 }}>No progress found</p>;

  const percent = progress?.progress ?? 0;

  return (
    <div style={styles.page}>
      {/* ✅ Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>📈 Course Progress</h2>
          <p style={styles.subtitle}>
            Track your learning progress and finish your course 🎯
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => navigate(`/courses/${courseId}`)}>
          ← Back to Course
        </button>
      </div>

      {/* ✅ Completed Banner */}
      {progress.completed && (
        <div style={styles.completedBanner}>
          🎉 Congratulations! You completed this course.
          {progress.certificate_available ? " Certificate available ✅" : ""}
        </div>
      )}

      {/* ✅ Main Layout */}
      <div style={styles.grid}>
        {/* ✅ Progress Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Overall Progress</h3>

          <div style={styles.progressWrap}>
            <div style={styles.progressRing}>
              <div style={styles.progressInner}>
                <p style={styles.progressPercent}>{percent}%</p>
                <p style={styles.progressText}>Completed</p>
              </div>

              {/* ring fill */}
              <div
                style={{
                  ...styles.ringFill,
                  background: `conic-gradient(#4f46e5 ${percent * 3.6}deg, #e2e8f0 0deg)`,
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <p style={styles.smallLabel}>Lesson Completion</p>

              <div style={styles.barBg}>
                <div style={{ ...styles.barFill, width: `${percent}%` }} />
              </div>

              <p style={styles.smallText}>
                {(progress.videos_completed ?? progress.lessons_completed ?? 0)} /{" "}
                {(progress.total_videos ?? progress.total_lessons ?? 0)} lessons completed
              </p>

              <button
                style={styles.primaryBtn}
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                Continue Learning →
              </button>

              {/* ✅ VIEW CERTIFICATE BUTTON (Frontend Certificate Page) */}
              {progress.certificate_available && (
                <button style={styles.certificateBtn} onClick={openCertificate}>
                  🎓 View Certificate
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Stats Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Details</h3>

          <div style={styles.statsGrid}>
            <MiniStat
              label="Lessons Completed"
              value={progress.videos_completed ?? progress.lessons_completed ?? 0}
              color="#22c55e"
              icon="✅"
            />

            <MiniStat
              label="Total Lessons"
              value={progress.total_videos ?? progress.total_lessons ?? 0}
              color="#3b82f6"
              icon="📚"
            />

            <MiniStat
              label="Quiz Status"
              value={progress.quiz_passed ? "Passed" : "Not Passed"}
              color={progress.quiz_passed ? "#16a34a" : "#ef4444"}
              icon={progress.quiz_passed ? "🏆" : "❌"}
            />

            <MiniStat
              label="Course Status"
              value={progress.completed ? "Completed" : "In Progress"}
              color={progress.completed ? "#4f46e5" : "#f59e0b"}
              icon={progress.completed ? "🎉" : "⏳"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ Mini Stat Component */
function MiniStat({ label, value, icon, color }) {
  return (
    <div style={styles.miniCard}>
      <div style={{ ...styles.miniIcon, background: color }}>{icon}</div>
      <div>
        <p style={styles.miniLabel}>{label}</p>
        <p style={styles.miniValue}>{value}</p>
      </div>
    </div>
  );
}

/* ✅ Styles */
const styles = {
  page: {
    padding: "28px",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.14), transparent 45%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "18px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "900",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#64748b",
    fontWeight: "600",
    fontSize: "14px",
  },

  backBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
    background: "#eef2ff",
    color: "#4f46e5",
  },

  completedBanner: {
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#dcfce7",
    border: "1px solid #bbf7d0",
    color: "#166534",
    fontWeight: "900",
    marginBottom: "18px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "18px",
    alignItems: "start",
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
    border: "1px solid rgba(148,163,184,0.25)",
  },

  cardTitle: {
    margin: 0,
    marginBottom: "14px",
    fontSize: "16px",
    fontWeight: "900",
    color: "#0f172a",
  },

  progressWrap: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },

  progressRing: {
    width: "160px",
    height: "160px",
    borderRadius: "999px",
    position: "relative",
    display: "grid",
    placeItems: "center",
  },

  ringFill: {
    position: "absolute",
    inset: 0,
    borderRadius: "999px",
  },

  progressInner: {
    width: "126px",
    height: "126px",
    borderRadius: "999px",
    background: "white",
    zIndex: 2,
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },

  progressPercent: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "900",
    color: "#0f172a",
    lineHeight: 1,
  },

  progressText: {
    margin: 0,
    marginTop: "4px",
    fontSize: "13px",
    fontWeight: "800",
    color: "#64748b",
  },

  smallLabel: {
    margin: 0,
    fontWeight: "900",
    color: "#0f172a",
    fontSize: "13px",
  },

  barBg: {
    marginTop: "10px",
    width: "100%",
    height: "10px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    background: "#4f46e5",
    borderRadius: "999px",
  },

  smallText: {
    marginTop: "10px",
    marginBottom: "14px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748b",
  },

  primaryBtn: {
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "12px",
    width: "100%",
    borderRadius: "14px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(79,70,229,0.25)",
  },

  certificateBtn: {
    marginTop: "12px",
    width: "100%",
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(22,163,74,0.25)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  miniCard: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "12px",
    borderRadius: "16px",
    background: "white",
    border: "1px solid #e2e8f0",
  },

  miniIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "14px",
    display: "grid",
    placeItems: "center",
    color: "white",
    fontWeight: "900",
    fontSize: "16px",
  },

  miniLabel: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "800",
    color: "#64748b",
  },

  miniValue: {
    margin: 0,
    marginTop: "2px",
    fontSize: "14px",
    fontWeight: "900",
    color: "#0f172a",
  },
};
