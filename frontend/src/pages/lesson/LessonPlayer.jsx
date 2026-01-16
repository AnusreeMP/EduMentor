import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function LessonPlayer() {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ sidebar lessons list (optional but pro)
    const [siblings, setSiblings] = useState([]);
    const [courseId, setCourseId] = useState(null);
    const [moduleId, setModuleId] = useState(null);

    // ✅ progress state
    const [saving, setSaving] = useState(false);
    const [completed, setCompleted] = useState(false);

    // ✅ Fetch lesson detail
    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            try {
                // ✅ You must create this API in backend:
                // GET /api/lessons/<lessonId>/
                const res = await api.get(`/lessons/${lessonId}/`);
                const data = res.data;
                setLesson(data);

                setCourseId(data.course_id);
                setModuleId(data.module_id);

                // ✅ if backend sends this
                setCompleted(Boolean(data.is_completed));
            } catch (err) {
                console.log("Lesson fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    // ✅ Fetch module lessons list (for next/prev + sidebar)
    useEffect(() => {
        const fetchSiblings = async () => {
            if (!moduleId) return;

            try {
                // ✅ You must create this API in backend:
                // GET /api/modules/<moduleId>/lessons/
                const res = await api.get(`/modules/${moduleId}/lessons/`);
                setSiblings(res.data || []);
            } catch (err) {
                console.log("Module lessons fetch error:", err);
            }
        };

        fetchSiblings();
    }, [moduleId]);

    // ✅ next / prev finding
    const currentIndex = siblings.findIndex((l) => String(l.id) === String(lessonId));
    const prevLesson = currentIndex > 0 ? siblings[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

    const markCompleted = async () => {
        if (!lesson) return;

        setSaving(true);
        try {
            // ✅ existing backend endpoint you have:
            // POST /api/video-progress/<lessonId>/
            await api.post(`/video-progress/${lesson.id}/`, {
                watched_seconds: 9999,
                is_completed: true,
            });

            setCompleted(true);
        } catch (err) {
            console.log("Progress save error:", err);
            alert("Progress not saved. Check API.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={{ padding: 30 }}>Loading lesson...</p>;
    if (!lesson) return <p style={{ padding: 30 }}>Lesson not found</p>;

    return (
        <div style={styles.page}>
            {/* ✅ Top Header */}
            <div style={styles.topBar}>
                <button style={styles.backBtn} onClick={() => navigate(`/courses/${courseId}`)}>
                    ← Back to Course
                </button>

                <div style={styles.titleWrap}>
                    <h2 style={styles.title}>{lesson.title}</h2>
                    <p style={styles.subTitle}>{lesson.description || "Watch and learn step-by-step 🎯"}</p>
                </div>

                <button
                    style={{
                        ...styles.completeBtn,
                        background: completed ? "#16a34a" : "#0f172a",
                        opacity: saving ? 0.6 : 1,
                    }}
                    onClick={markCompleted}
                    disabled={saving || completed}
                >
                    {completed ? "✅ Completed" : saving ? "Saving..." : "Mark Completed"}
                </button>
            </div>

            <div style={styles.layout}>
                {/* ✅ Left Video Area */}
                <div style={styles.playerCard}>
                    <div style={styles.videoWrap}>
                        {lesson.video_url ? (
                            <video
                                src={lesson.video_url}
                                controls
                                style={styles.video}
                            />
                        ) : (
                            <div style={styles.noVideo}>
                                <p style={{ margin: 0, fontWeight: 800 }}>No video uploaded</p>
                                <p style={{ marginTop: 6, color: "#64748b" }}>
                                    Admin must add lesson video url
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ✅ Next / Prev Buttons */}
                    <div style={styles.navRow}>
                        <button
                            style={{ ...styles.navBtn, opacity: prevLesson ? 1 : 0.5 }}
                            disabled={!prevLesson}
                            onClick={() => navigate(`/lessons/${prevLesson.id}`)}
                        >
                            ← Previous
                        </button>

                        <button
                            style={{ ...styles.navBtn, opacity: nextLesson ? 1 : 0.5 }}
                            disabled={!nextLesson}
                            onClick={() => navigate(`/lessons/${nextLesson.id}`)}
                        >
                            Next →
                        </button>
                    </div>
                </div>

                {/* ✅ Right Sidebar */}
                <div style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>📌 Lessons</h3>

                    {siblings.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No lessons found</p>
                    ) : (
                        <div style={styles.lessonList}>
                            {siblings.map((l) => (
                                <button
                                    key={l.id}
                                    style={{
                                        ...styles.lessonItem,
                                        border:
                                            String(l.id) === String(lessonId)
                                                ? "2px solid #4f46e5"
                                                : "1px solid #e2e8f0",
                                        background:
                                            String(l.id) === String(lessonId) ? "#eef2ff" : "white",
                                    }}
                                    onClick={() => navigate(`/lessons/${l.id}`)}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                        <span style={{ fontWeight: 800, color: "#0f172a" }}>{l.title}</span>
                                        <span style={{ fontSize: 12, color: "#64748b" }}>
                                            {l.duration_minutes ? `${l.duration_minutes}m` : ""}
                                        </span>
                                    </div>

                                    {l.description && (
                                        <p style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
                                            {l.description.slice(0, 55)}...
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ✅ Styles */
const styles = {
    page: {
        padding: "22px",
        minHeight: "100vh",
        background: "#f5f9ff",
    },

    topBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "18px",
        background: "white",
        padding: "16px 18px",
        borderRadius: "18px",
        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
        marginBottom: "20px",
    },

    backBtn: {
        border: "none",
        background: "#eef2ff",
        color: "#4f46e5",
        padding: "10px 12px",
        borderRadius: "12px",
        fontWeight: "800",
        cursor: "pointer",
        whiteSpace: "nowrap",
    },

    titleWrap: { flex: 1 },
    title: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "900",
        color: "#0f172a",
    },
    subTitle: {
        marginTop: "6px",
        marginBottom: 0,
        color: "#64748b",
        fontSize: "13px",
        fontWeight: "600",
    },

    completeBtn: {
        border: "none",
        color: "white",
        padding: "10px 14px",
        borderRadius: "12px",
        fontWeight: "900",
        cursor: "pointer",
        whiteSpace: "nowrap",
    },

    layout: {
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: "18px",
        alignItems: "start",
    },

    playerCard: {
        background: "white",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    },

    videoWrap: {
        width: "100%",
        background: "#0b1220",
    },

    video: {
        width: "100%",
        height: "420px",
        objectFit: "cover",
        display: "block",
    },

    noVideo: {
        height: "420px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
    },

    navRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "14px",
        background: "white",
    },

    navBtn: {
        border: "none",
        background: "#4f46e5",
        color: "white",
        padding: "10px 14px",
        borderRadius: "12px",
        fontWeight: "900",
        cursor: "pointer",
    },

    sidebar: {
        background: "white",
        borderRadius: "18px",
        padding: "16px",
        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    },

    sidebarTitle: {
        margin: 0,
        fontSize: "16px",
        fontWeight: "900",
        color: "#0f172a",
        marginBottom: "12px",
    },

    lessonList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    lessonItem: {
        width: "100%",
        textAlign: "left",
        padding: "12px",
        borderRadius: "14px",
        cursor: "pointer",
        background: "white",
    },
};
