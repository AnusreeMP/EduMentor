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
      const res = await api.get(`/courses/${courseId}/modules/`);
      setModules(res.data);
    } catch {
      alert("Failed to load modules");
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this module?")) return;

    await api.delete(`/modules/${id}/`);
    setModules(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div>
      <h2>Manage Modules</h2>

      <Link to={`/admin/courses/${courseId}/modules/add`}>
        + Add Module
      </Link>

      <table style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(module => (
            <tr key={module.id}>
              <td>{module.order}</td>
              <td>{module.title}</td>
              <td>
                <Link to={`/admin/modules/${module.id}/edit`}>Edit</Link>{" "}
                <button onClick={() => deleteModule(module.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
