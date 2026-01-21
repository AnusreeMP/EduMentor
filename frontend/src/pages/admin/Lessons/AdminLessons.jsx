import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getAdminLessons, deleteLesson } from "../../../api/lessons";

export default function AdminLessons() {
    const { moduleId, courseId } = useParams();
    const navigate = useNavigate();

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchLessons();
        // eslint-disable-next-line
    }, [moduleId]);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const res = await getAdminLessons(moduleId);
            setLessons(res.data || []);
        } catch (err) {
            console.log("Fetch lessons error:", err?.response?.data || err);
            alert("❌ Failed to load lessons");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (lessonId) => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) return;

        try {
            await deleteLesson(lessonId);
            alert("✅ Lesson deleted!");
            fetchLessons();
        } catch (err) {
            console.log("Delete lesson error:", err?.response?.data || err);
            alert("❌ Failed to delete lesson");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* ✅ Header */}
                <div style={styles.headerRow}>
                    <div>
                        <h2 style={styles.title}>📘 Lessons</h2>
                        <p style={styles.subtitle}>
                            Manage lessons inside Module ID: <b>{moduleId}</b>
                        </p>
                    </div>

                    <div style={styles.headerBtns}>
                        <button
                            style={styles.backBtn}
                            onClick={() => navigate(`/admin/courses/${courseId}/modules`)}
                        >
                            ← Back
                        </button>

                        <Link to="add" style={styles.addBtn}>
                            ➕ Add Lesson
                        </Link>
                    </div>
                </div>

                {/* ✅ Loading */}
                {loading ? (
                    <p style={styles.loadingText}>Loading lessons...</p>
                ) : lessons.length === 0 ? (
                    <p style={styles.emptyText}>No lessons found for this module.</p>
                ) : (
                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Order</th>
                                    <th style={styles.th}>Title</th>
                                    <th style={{ ...styles.th, width: "220px" }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lessons.map((lesson) => (
                                    <tr key={lesson.id} style={styles.tr}>
                                        <td style={styles.td}>{lesson.order}</td>
                                        <td style={styles.tdTitle}>{lesson.title}</td>

                                        <td style={styles.td}>
                                            <div style={styles.actionRow}>
                                                <Link
                                                    to={`edit/${lesson.id}`}
                                                    style={styles.editBtn}
                                                >
                                                    ✏️ Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(lesson.id)}
                                                    style={styles.deleteBtn}
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
            </div>
        </div>
    );
}

/* ✅ Premium Styles */
const styles = {
    page: {
        minHeight: "100vh",
        padding: "26px",
        display: "block",
        placeItems: "center",
        background:
            "radial-gradient(circle at top, rgba(79,70,229,0.18), transparent 50%), linear-gradient(180deg, #f8fafc, #eef2ff)",
    },

    card: {
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        background: "rgba(255,255,255,0.92)",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid rgba(148,163,184,0.25)",
        boxShadow: "0 18px 40px rgba(2,6,23,0.12)",
        backdropFilter: "blur(10px)",
    },

    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
        flexWrap: "wrap",
    },

    title: {
        margin: 0,
        fontSize: "26px",
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
        textDecoration: "none",
        background: "#16a34a",
        color: "white",
        padding: "10px 14px",
        borderRadius: "14px",
        fontWeight: 900,
        boxShadow: "0 16px 30px rgba(22,163,74,0.18)",
    },

    loadingText: {
        fontWeight: 900,
        color: "#64748b",
        paddingTop: "10px",
    },

    emptyText: {
        fontWeight: 900,
        color: "#64748b",
        paddingTop: "10px",
    },

    tableWrap: {
        overflowX: "auto",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        marginTop: "10px",
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
        fontWeight: "900",
        background: "#f8fafc",
    },

    tr: {
        borderBottom: "1px solid #f1f5f9",
    },

    td: {
        padding: "14px",
        fontSize: "14px",
        color: "#334155",
        fontWeight: 700,
    },

    tdTitle: {
        padding: "14px",
        fontSize: "14px",
        color: "#0f172a",
        fontWeight: 900,
    },

    actionRow: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },

    editBtn: {
        textDecoration: "none",
        background: "#4f46e5",
        color: "white",
        padding: "8px 12px",
        borderRadius: "12px",
        fontWeight: 900,
        fontSize: "13px",
        boxShadow: "0 10px 20px rgba(79,70,229,0.20)",
    },

    deleteBtn: {
        border: "none",
        background: "#dc2626",
        color: "white",
        padding: "8px 12px",
        borderRadius: "12px",
        fontWeight: 900,
        fontSize: "13px",
        cursor: "pointer",
        boxShadow: "0 10px 20px rgba(220,38,38,0.18)",
    },
};
