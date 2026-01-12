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
    if (!title) return alert("Title is required");

    try {
      setLoading(true);
      await addModule(courseId, { title, description, order });
      navigate(`/admin/courses/${courseId}/modules`);
    } catch {
      alert("Failed to add module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Module</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Module title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <input
          type="number"
          min="1"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={styles.input}
        />

        <button disabled={loading} style={styles.btn}>
          {loading ? "Saving..." : "Add Module"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "500px", background: "#fff", padding: "24px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  textarea: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  btn: { background: "#4f46e5", color: "#fff", padding: "10px", border: "none", borderRadius: "6px" },
};
