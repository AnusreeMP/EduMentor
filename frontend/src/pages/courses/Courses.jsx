import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses/")
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  const enroll = async (courseId) => {
    await api.post(`/courses/${courseId}/enroll/`);
    alert("Enrolled successfully");
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Courses</h2>

      {courses.map(course => (
        <div
          key={course.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>

          <button onClick={() => enroll(course.id)}>Enroll</button>

          <Link to={`/courses/${course.id}`}>
            <button style={{ marginLeft: "10px" }}>
              View Course
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
