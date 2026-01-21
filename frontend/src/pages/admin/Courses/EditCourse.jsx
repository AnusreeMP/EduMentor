import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}/`);
        setForm({
          title: res.data?.title || "",
          description: res.data?.description || "",
        });
      } catch (err) {
        console.log(err);
        alert("❌ Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/admin/courses/${id}/`, form);
      alert("✅ Course Updated Successfully!");
      navigate("/admin/courses");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete course
  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this course?");
    if (!ok) return;

    try {
      await api.delete(`/admin/courses/${id}/`);
      alert("✅ Course deleted!");
      navigate("/admin/courses");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to delete course");
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading course...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>✏️ Edit Course</h2>
            <p style={styles.subtitle}>Update course details and save changes</p>
          </div>

          <button style={styles.backBtn} onClick={() => navigate("/admin/courses")}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Course Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Eg: Django Course"
            />
          </div>

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

          <div style={styles.btnRow}>
            <button type="button" style={styles.deleteBtn} onClick={handleDelete}>
              🗑 Delete
            </button>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : "✅ Update Course"}
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
  subtitle: { margin: 0, marginTop: "6px", fontSize: "13px", fontWeight: 700, color: "#64748b" },
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
  btnRow: { display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "8px" },
  deleteBtn: {
    border: "none",
    background: "#ef4444",
    color: "white",
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
