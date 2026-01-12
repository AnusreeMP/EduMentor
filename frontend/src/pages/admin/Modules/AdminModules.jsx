import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function AdminModules() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      // ✅ ADMIN API (correct)
      const res = await api.get(
      `/courses/${courseId}/modules/`
      );
      setModules(res.data);
    } catch {
      alert("Failed to load modules");
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this module?")) return;

    try {
      // ✅ ADMIN API (correct)
      await api.delete(
        `/admin/modules/${id}/delete/`
      );
      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Failed to delete module");
    }
  };

  return (
    <div>
      <h2>Manage Modules</h2>

      {/* ✅ SINGLE Add Module button */}
      <Link
        to={`/admin/courses/${courseId}/modules/add`}
        style={styles.addBtn}
      >
        + Add Module
      </Link>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th style={{ width: "160px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {modules.length === 0 ? (
            <tr>
              <td colSpan="3">No modules found</td>
            </tr>
          ) : (
            modules.map((module) => (
              <tr key={module.id}>
                <td>{module.order}</td>
                <td>{module.title}</td>
                <td style={styles.actions}>
                  <Link
                    to={`/admin/courses/${courseId}/modules/edit/${module.id}`}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteModule(module.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  addBtn: {
    display: "inline-block",
    marginBottom: "12px",
    background: "#4f46e5",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "500",
  },
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
    background: "#fff",
  },
  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontWeight: "500",
  },
};
