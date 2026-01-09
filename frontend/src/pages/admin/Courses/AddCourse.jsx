import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCourse } from "../../../api/courses";


export default function AddCourse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // ✅ ADMIN API (clean layer)
      await addCourse({
        title,
        description,
      });

      alert("Course added successfully");
      navigate("/admin/courses");
    } catch (err) {
      console.error("Add course error:", err);
      alert("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Course</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Course Title</label>
        <input
          type="text"
          placeholder="Enter course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Course Description</label>
        <textarea
          placeholder="Enter course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          style={styles.textarea}
        />

        <div style={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? "Saving..." : "Add Course"}
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
  submitBtn: {
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
