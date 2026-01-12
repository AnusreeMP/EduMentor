import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminModule, editModule } from "../../../api/modules";

export default function EditModule() {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [order, setOrder] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModule();
    }, []);

    const fetchModule = async () => {
        try {
            const res = await getAdminModule(moduleId);
            setTitle(res.data.title);
            setDescription(res.data.description || "");
            setOrder(res.data.order);
        } catch {
            alert("Failed to load module data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await editModule(moduleId, {
                title,
                description,
                order,
            });
            navigate(`/admin/courses/${courseId}/modules`);
        } catch {
            alert("Failed to update module");
        }
    };

    if (loading) return <p>Loading module...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Edit Module</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>Module Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    style={styles.textarea}
                />

                <label style={styles.label}>Order</label>
                <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    style={styles.input}
                />

                <div style={styles.actions}>
                    <button type="submit" style={styles.saveBtn}>
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/courses/${courseId}/modules`)
                        }
                        style={styles.cancelBtn}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ===== STYLES (PROFESSIONAL UI) ===== */
const styles = {
    container: {
        maxWidth: "600px",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },
    heading: {
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    label: {
        fontWeight: "500",
        fontSize: "14px",
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
    },
    textarea: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
    },
    actions: {
        display: "flex",
        gap: "12px",
        marginTop: "10px",
    },
    saveBtn: {
        background: "#4f46e5",
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "500",
    },
    cancelBtn: {
        background: "#e5e7eb",
        color: "#111827",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
    },
};
