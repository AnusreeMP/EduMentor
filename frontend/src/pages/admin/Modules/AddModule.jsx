import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function AddModule() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post(`/courses/${courseId}/modules/`, {
      title,
      description,
      order,
    });

    navigate(`/admin/courses/${courseId}/modules`);
  };

  return (
    <div>
      <h2>Add Module</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Module title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="number"
          value={order}
          onChange={e => setOrder(e.target.value)}
        />

        <button type="submit">Add Module</button>
      </form>
    </div>
  );
}
