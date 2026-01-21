import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addModule } from "../../../api/modules";

export default function AddModule() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("❌ Title is required");

    try {
      setLoading(true);

      await addModule(courseId, {
        title,
        description,
        order: Number(order),
      });

      alert("✅ Module Added Successfully!");
      navigate(`/admin/courses/${courseId}/modules`);
    } catch (err) {
      console.log("Add module error:", err);
      alert("❌ Failed to add module (check backend API)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ HEADER */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>➕ Add Module</h2>
            <p style={styles.subtitle}>
              Create a new module inside Course ID: <b>{courseId}</b>
            </p>
          </div>

          <button
            style={styles.backBtn}
            onClick={() => navigate(`/admin/courses/${courseId}/modules`)}
          >
            ← Back
          </button>

          <button
            style={styles.quizBtn}
            onClick={() =>
              navigate(`/admin/courses/${courseId}/modules/${m.id}/quiz`)
            }
          >
            📝 Quiz
          </button>

        </div>

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Module Title *</label>
            <input
              style={styles.input}
              placeholder="Eg: Basics of React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              placeholder="Write module description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Order */}
          <div style={styles.field}>
            <label style={styles.label}>Module Order *</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              required
            />
            <p style={styles.helperText}>
              This decides the module display order (1,2,3...)
            </p>
          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate(`/admin/courses/${courseId}/modules`)}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? "Saving..." : "✅ Add Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ✅ Styles (Premium Admin UI) */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "26px",
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.18), transparent 50%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  card: {
    width: "100%",
    maxWidth: "680px",
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
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },

  form: {
    display: "grid",
    gap: "14px",
    marginTop: "6px",
  },

  field: {
    display: "grid",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 900,
    color: "#334155",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    fontWeight: 700,
    outline: "none",
    background: "white",
  },

  textarea: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    fontWeight: 700,
    outline: "none",
    background: "white",
    minHeight: "110px",
    resize: "vertical",
  },

  helperText: {
    margin: 0,
    marginTop: "4px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#94a3b8",
  },

  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "6px",
  },

  cancelBtn: {
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#0f172a",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },

  saveBtn: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(22,163,74,0.18)",
  },
};
