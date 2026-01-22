import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function AddCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
  });

  const [saving, setSaving] = useState(false);

  const DEFAULT_THUMB =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=60";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // ✅ send thumbnail as "" if empty (backend will store null/blank)
      const payload = {
        title: form.title,
        description: form.description,
        thumbnail: form.thumbnail.trim() || "",
      };

      await api.post("/admin/courses/", payload);

      alert("✅ Course created successfully!");
      navigate("/admin/courses");
    } catch (err) {
      console.log("Add course error:", err?.response?.data || err);
      alert(JSON.stringify(err?.response?.data || "❌ Failed to create course", null, 2));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>➕ Add Course</h2>
            <p style={styles.subtitle}>Create a new course</p>
          </div>

          <button style={styles.backBtn} onClick={() => navigate("/admin/courses")}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* ✅ Title */}
          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Eg: Flutter App Development"
            />
          </div>

          {/* ✅ Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea
              style={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Write course description..."
            />
          </div>

          {/* ✅ Thumbnail URL (Optional) */}
          <div style={styles.field}>
            <label style={styles.label}>Thumbnail Image URL (optional)</label>
            <input
              style={styles.input}
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="Paste image link (https://...)"
            />
            <p style={styles.helperText}>
              ✅ If you leave this empty, default image will be used automatically.
            </p>
          </div>

          {/* ✅ Preview */}
          <div style={styles.previewBox}>
            <p style={styles.previewTitle}>🖼 Thumbnail Preview</p>
            <img
              src={form.thumbnail.trim() ? form.thumbnail : DEFAULT_THUMB}
              alt="Preview"
              style={styles.previewImg}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_THUMB;
              }}
            />
          </div>

          <div style={styles.btnRow}>
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : "✅ Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
    maxWidth: "700px",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
    backdropFilter: "blur(10px)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  title: { margin: 0, fontSize: "24px", fontWeight: 900, color: "#0f172a" },
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
  form: { display: "grid", gap: "12px" },
  field: { display: "grid", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 900, color: "#334155" },
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
    minHeight: "120px",
    resize: "vertical",
  },
  helperText: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748b",
  },
  previewBox: {
    marginTop: "4px",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "12px",
    background: "#ffffff",
  },
  previewTitle: {
    margin: 0,
    marginBottom: "8px",
    fontWeight: 900,
    fontSize: "13px",
    color: "#334155",
  },
  previewImg: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },
  btnRow: { display: "flex", justifyContent: "flex-end", marginTop: "6px" },
  saveBtn: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
};
