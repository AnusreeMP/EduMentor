import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get("/lessons/"); // ✅ backend should give all lessons
        setLessons(res.data || []);
      } catch (err) {
        console.log("Lessons fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <p style={{ padding: 30 }}>Loading lessons...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ fontWeight: 900 }}>All Lessons</h2>

      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <table style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>ID</th>
              <th>Title</th>
              <th>Module</th>
              <th>Order</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.title}</td>
                <td>{l.module}</td>
                <td>{l.order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
