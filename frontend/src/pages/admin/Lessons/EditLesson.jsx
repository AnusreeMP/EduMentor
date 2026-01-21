import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function EditLesson() {
  const navigate = useNavigate();

  // ✅ FIX: get courseId also
  const { courseId, moduleId, lessonId } = useParams();

  const [form, setForm] = useState({
    title: "",
    content: "",
    video_url: "",
    order: 1,
  });

  const [loadingLesson, setLoadingLesson] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Load lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${lessonId}/`);
        const lesson = res.data;

        setForm({
          title: lesson.title || "",
          content: lesson.content || "",
          video_url: lesson.video_url || "",
          order: lesson.order || 1,
        });
      } catch (err) {
        console.log("Lesson fetch error:", err?.response?.data || err);
        alert("❌ Failed to load lesson");
      } finally {
        setLoadingLesson(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update Lesson
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        content: form.content,
        video_url: form.video_url,
        order: Number(form.order),
        module: Number(moduleId),
      };

      await api.put(`/admin/lessons/${lessonId}/edit/`, payload);

      alert("✅ Lesson Updated Successfully!");

      // ✅ FIXED redirect (NEW route)
      navigate(`/admin/courses/${courseId}/modules/${moduleId}/lessons`);
    } catch (err) {
      console.log("Update lesson error:", err?.response?.data || err);
      alert(JSON.stringify(err?.response?.data, null, 2));
    } finally {
      setSaving(false);
    }
  };

  if (loadingLesson) {
    return <p style={{ padding: 30, fontWeight: 900 }}>Loading lesson...</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>✏️ Edit Lesson</h2>
            <p style={styles.subtitle}>
              Module ID: <b>{moduleId}</b>
            </p>
          </div>

          {/* ✅ FIXED back button */}
          <button
            style={styles.backBtn}
            onClick={() =>
              navigate(`/admin/courses/${courseId}/modules/${moduleId}/lessons`)
            }
          >
            ← Back
          </button>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Lesson Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Lesson Order *</label>
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

          <div style={styles.field}>
            <label style={styles.label}>Video URL *</label>
            <input
              style={styles.input}
              name="video_url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/xxxx"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Lesson Content *</label>
            <textarea
              style={styles.textarea}
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write lesson details here..."
              required
            />
          </div>

          <div style={styles.btnRow}>
            {/* ✅ FIXED cancel button */}
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() =>
                navigate(`/admin/courses/${courseId}/modules/${moduleId}/lessons`)
              }
            >
              Cancel
            </button>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Updating..." : "✅ Update Lesson"}
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
    display: "block",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.18), transparent 50%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.12)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
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

  form: { display: "grid", gap: "14px", marginTop: "10px" },
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
    minHeight: "100px",
    resize: "vertical",
  },

  btnRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "8px",
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
    background: "#4f46e5",
    color: "white",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(79,70,229,0.22)",
  },
};
