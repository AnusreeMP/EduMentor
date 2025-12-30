import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function CourseDetail() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        // 1️⃣ Fetch course details
        const courseRes = await api.get(`/courses/${courseId}/`);
        setCourse(courseRes.data);

        // 2️⃣ Fetch modules of this course
        const moduleRes = await api.get(`/courses/${courseId}/modules/`);
        setModules(moduleRes.data);
      } catch (err) {
        console.error(err);
        setError("You are not enrolled or course not found");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndModules();
  }, [courseId]);

  if (loading) return <p>Loading course...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Course info */}
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <hr />

      {/* Modules */}
      <h3>Modules</h3>

      {modules.length === 0 && (
        <p>No modules added yet.</p>
      )}

      {modules.map((module) => (
        <div
          key={module.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h4>
            {module.order}. {module.title}
          </h4>

          <p>{module.description}</p>

          {/* ✅ CORRECT LINK */}
          <Link to={`/courses/${course.id}/modules/${module.id}`}>
            <button>Open Module</button>
          </Link>
        </div>
      ))}


      {/* Progress */}
      <Link to={`/progress/${courseId}`}>
        <button>View Course Progress</button>
      </Link>
    </div>
  );
}
