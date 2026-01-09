import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function EditModule() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);

  useEffect(() => {
    api.get(`/modules/${moduleId}/`).then(res => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setOrder(res.data.order);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.put(`/modules/${moduleId}/`, {
      title,
      description,
      order,
    });

    navigate(-1);
  };

  return (
    <div>
      <h2>Edit Module</h2>

      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} />
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
        <input type="number" value={order} onChange={e => setOrder(e.target.value)} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
