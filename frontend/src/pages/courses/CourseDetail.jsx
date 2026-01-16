import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  const isEnrolled = !!course?.is_enrolled;

  // ✅ load course + modules
  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const courseRes = await api.get(`/courses/${courseId}/`);
      setCourse(courseRes.data);

      if (courseRes.data.is_enrolled) {
        const moduleRes = await api.get(`/courses/${courseId}/modules/`);
        setModules(moduleRes.data || []);
      } else {
        setModules([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await api.post(`/courses/${courseId}/enroll/`);
      await fetchCourse(); // ✅ reload data properly (no page refresh)
    } catch (err) {
      console.log("Enroll error:", err);
      alert("Enroll failed. Try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const courseStats = useMemo(() => {
    return [
      { label: "Level", value: course?.level || "Beginner", color: "#2563eb" },
      { label: "Modules", value: modules?.length || 0, color: "#7c3aed" },
      { label: "Access", value: isEnrolled ? "Unlocked" : "Locked", color: isEnrolled ? "#16a34a" : "#f59e0b" },
    ];
  }, [course, modules, isEnrolled]);

  if (loading) return <p style={{ padding: 30 }}>Loading course...</p>;
  if (error) return <p style={{ padding: 30, color: "red", fontWeight: 800 }}>{error}</p>;

  return (
    <div style={styles.page}>
      {/* ✅ HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.breadcrumb}>
            <span onClick={() => navigate("/courses")} style={styles.breadcrumbLink}>
              Courses
            </span>{" "}
            / <span style={{ opacity: 0.85 }}>{course.title}</span>
          </p>

          <h2 style={styles.heroTitle}>{course.title}</h2>
          <p style={styles.heroDesc}>{course.description || "No description available."}</p>

          {/* ✅ Stats chips */}
          <div style={styles.chipsRow}>
            {courseStats.map((s) => (
              <div key={s.label} style={{ ...styles.chip, borderColor: s.color }}>
                <span style={{ ...styles.dot, background: s.color }} />
                <span style={styles.chipText}>
                  {s.label}: <b>{s.value}</b>
                </span>
              </div>
            ))}
          </div>

          {/* ✅ Action buttons */}
          <div style={styles.actionsRow}>
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                style={{
                  ...styles.primaryBtn,
                  opacity: enrolling ? 0.75 : 1,
                  cursor: enrolling ? "not-allowed" : "pointer",
                }}
              >
                {enrolling ? "Enrolling..." : "Enroll Now →"}
              </button>
            ) : (
              <>
                <div style={styles.enrolledBadge}>✅ Enrolled</div>

                {/* ✅ Optional Continue Learning (if backend sends last_lesson_id) */}
                <button
                  onClick={() => {
                    if (course.last_lesson_id) navigate(`/lessons/${course.last_lesson_id}`);
                    else if (modules[0]?.id) navigate(`/courses/${courseId}/modules/${modules[0].id}`);
                    else navigate(`/courses/${courseId}`);
                  }}
                  style={styles.darkBtn}
                >
                  Continue Learning →
                </button>
              </>
            )}

            {isEnrolled && (
              <Link to={`/progress/${courseId}`} style={styles.outlineBtn}>
                View Progress
              </Link>
            )}
          </div>
        </div>

        {/* ✅ Right card */}
        <div style={styles.heroRight}>
          <div style={styles.previewCard}>
            <div style={styles.previewTop}>
              <div style={styles.previewIcon}>🎓</div>
              <div>
                <p style={styles.previewLabel}>Course Type</p>
                <p style={styles.previewValue}>{course.is_premium ? "Premium" : "Free"}</p>
              </div>
            </div>

            <div style={styles.previewLine} />
            <p style={styles.previewSmall}>
              {isEnrolled
                ? "You have access to all modules and lessons."
                : "Enroll to unlock all modules and lessons."}
            </p>

            {!isEnrolled ? (
              <button onClick={handleEnroll} style={styles.previewBtn}>
                Unlock Modules 🔓
              </button>
            ) : (
              <button
                onClick={() => navigate(`/progress/${courseId}`)}
                style={{ ...styles.previewBtn, background: "#16a34a" }}
              >
                Track Progress 📈
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🔒 WARNING */}
      {!isEnrolled && (
        <div style={styles.lockBanner}>
          🔒 Please enroll in this course to access the modules.
        </div>
      )}

      {/* ✅ MODULES */}
      <div style={styles.sectionTop}>
        <h3 style={styles.sectionTitle}>📘 Course Modules</h3>
        <p style={styles.sectionSub}>
          {isEnrolled ? "Choose a module and start learning." : "Modules are locked until you enroll."}
        </p>
      </div>

      {/* Empty */}
      {isEnrolled && modules.length === 0 && (
        <div style={styles.emptyCard}>No modules added yet.</div>
      )}

      {/* Modules Grid */}
      <div style={styles.grid}>
        {modules.map((module) => (
          <div key={module.id} style={styles.moduleCard}>
            <div style={styles.moduleTop}>
              <div style={styles.moduleOrder}>Module {module.order}</div>
              <div style={styles.modulePill}>📌 {module.title?.length > 18 ? "Module" : "Topic"}</div>
            </div>

            <h4 style={styles.moduleTitle}>{module.title}</h4>
            <p style={styles.moduleDesc}>{module.description || "No description"}</p>

            <Link
              to={`/courses/${courseId}/modules/${module.id}`}
              style={styles.moduleBtn}
            >
              Open Module →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ✅ STYLES */
const styles = {
  page: {
    padding: "26px",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.14), transparent 45%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "18px",
    marginBottom: "18px",
  },

  heroLeft: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
  },

  breadcrumb: {
    margin: 0,
    fontWeight: 800,
    fontSize: "13px",
    color: "#64748b",
  },
  breadcrumbLink: {
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: 900,
  },

  heroTitle: {
    marginTop: "10px",
    marginBottom: "8px",
    fontSize: "28px",
    fontWeight: 900,
    color: "#0f172a",
  },
  heroDesc: {
    marginTop: 0,
    marginBottom: "14px",
    color: "#475569",
    fontWeight: 600,
    lineHeight: 1.5,
  },

  chipsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #e2e8f0",
    background: "white",
  },
  dot: { width: "10px", height: "10px", borderRadius: "999px" },
  chipText: { fontSize: "13px", fontWeight: 800, color: "#334155" },

  actionsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: "10px",
  },

  primaryBtn: {
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "12px 16px",
    borderRadius: "14px",
    fontWeight: 900,
    boxShadow: "0 16px 30px rgba(79,70,229,0.25)",
  },

  darkBtn: {
    border: "none",
    background: "#0f172a",
    color: "white",
    padding: "12px 16px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },

  outlineBtn: {
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: "14px",
    fontWeight: 900,
    color: "#4f46e5",
    background: "white",
    border: "1px solid #c7d2fe",
  },

  enrolledBadge: {
    background: "#dcfce7",
    color: "#166534",
    fontWeight: 900,
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid #bbf7d0",
  },

  heroRight: { display: "flex" },

  previewCard: {
    width: "100%",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
  },

  previewTop: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  previewIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    background: "#A7F3D0",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
    boxShadow: "0 14px 26px rgba(0,0,0,0.10)",
  },

  previewLabel: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 800,
    color: "#64748b",
  },
  previewValue: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 900,
    color: "#0f172a",
  },

  previewLine: {
    height: "1px",
    background: "#e2e8f0",
    margin: "14px 0",
  },

  previewSmall: {
    margin: 0,
    color: "#475569",
    fontWeight: 700,
    fontSize: "13px",
    lineHeight: 1.4,
  },

  previewBtn: {
    width: "100%",
    marginTop: "14px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },

  lockBanner: {
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#fef9c3",
    border: "1px solid #fde68a",
    color: "#854d0e",
    fontWeight: 900,
    marginBottom: "18px",
  },

  sectionTop: { marginBottom: "12px" },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 900,
    color: "#0f172a",
  },
  sectionSub: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#64748b",
    fontWeight: 700,
    fontSize: "13px",
  },

  emptyCard: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(148,163,184,0.25)",
    padding: "16px",
    borderRadius: "18px",
    fontWeight: 800,
    color: "#475569",
    boxShadow: "0 14px 30px rgba(2,6,23,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },

  moduleCard: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 18px 40px rgba(2,6,23,0.08)",
    transition: "0.2s",
  },

  moduleTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  moduleOrder: {
    fontWeight: 900,
    color: "#4f46e5",
    background: "#eef2ff",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  modulePill: {
    fontWeight: 800,
    color: "#0f172a",
    background: "#f1f5f9",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  moduleTitle: {
    margin: 0,
    fontWeight: 900,
    color: "#0f172a",
    fontSize: "16px",
  },

  moduleDesc: {
    marginTop: "8px",
    marginBottom: "14px",
    color: "#64748b",
    fontWeight: 600,
    fontSize: "13px",
    lineHeight: 1.45,
    minHeight: "40px",
  },

  moduleBtn: {
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    background: "#4f46e5",
    color: "white",
    padding: "10px 12px",
    borderRadius: "14px",
    fontWeight: 900,
    boxShadow: "0 14px 26px rgba(79,70,229,0.22)",
  },
};
