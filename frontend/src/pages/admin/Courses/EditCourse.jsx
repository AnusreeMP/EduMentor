import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function EditCourse() {
  const { id } = useParams(); // course id from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load existing course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}/`);
        setTitle(res.data.title);
        setDescription(res.data.description);
      } catch (err) {
        alert("Failed to load course");
        navigate("/admin/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  // 🔹 Update course
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("All fields are required");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/courses/${id}/`, {
        title,
        description,
      });

      alert("Course updated successfully");
      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading course...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Course</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Course Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Course Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          style={styles.textarea}
        />

        <div style={styles.actions}>
          <button
            type="submit"
            disabled={saving}
            style={styles.saveBtn}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  container: {
    maxWidth: "600px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
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
