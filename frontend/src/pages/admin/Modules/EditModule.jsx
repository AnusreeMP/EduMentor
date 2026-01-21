import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function EditModule() {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    order: 1,
    course: "", // ✅ REQUIRED
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch module detail
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`/admin/modules/${moduleId}/`);

        setForm({
          title: res.data?.title || "",
          description: res.data?.description || "",
          order: res.data?.order || 1,
          course: res.data?.course || "", // ✅ IMPORTANT
        });
      } catch (err) {
        console.log("Fetch module error:", err?.response?.data || err);
        alert("❌ Failed to load module");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update Module (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        order: Number(form.order),
        course: Number(form.course), // ✅ REQUIRED
      };

      await api.put(`/admin/modules/${moduleId}/`, payload);

      alert("✅ Module updated successfully!");
      navigate(-1);
    } catch (err) {
      console.log("Update module error:", err?.response?.data || err);
      alert(JSON.stringify(err?.response?.data, null, 2));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading module...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>✏️ Edit Module</h2>
            <p style={styles.subtitle}>Update your module details</p>
          </div>

          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Module Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Order *</label>
            <input
              style={styles.input}
              name="order"
              type="number"
              min="1"
              value={form.order}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ course field hidden (no need to show in UI) */}
          <input type="hidden" name="course" value={form.course} />

          <div style={styles.btnRow}>
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Updating..." : "✅ Update Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ✅ Styles */
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
    maxWidth: "650px",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.12)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
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
  form: { display: "grid", gap: "14px" },
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
    minHeight: "110px",
    resize: "vertical",
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
    boxShadow: "0 16px 30px rgba(22,163,74,0.18)",
  },
};
