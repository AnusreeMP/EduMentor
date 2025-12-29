import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/");
        setCourses(res.data);

        // Fetch progress for each course
        const progressMap = {};
        for (let course of res.data) {
          try {
            const p = await api.get(`/courses/${course.id}/progress/`);
            progressMap[course.id] = p.data;
          } catch {
            progressMap[course.id] = null;
          }
        }
        setProgress(progressMap);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const enroll = async (courseId) => {
    await api.post(`/courses/${courseId}/enroll/`);
    alert("Enrolled successfully");
    window.location.reload();
  };

  const downloadCertificate = (courseId) => {
    window.open(
      `http://127.0.0.1:8000/api/courses/${courseId}/certificate/`,
      "_blank"
    );
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Courses</h2>

      {courses.map(course => {
        const p = progress[course.id];

        return (
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

            {!p && (
              <button onClick={() => enroll(course.id)}>
                Enroll
              </button>
            )}

            {p && (
              <>
                <p>
                  Progress: <strong>{p.progress}%</strong>
                </p>

                <progress value={p.progress} max="100" />

                <div style={{ marginTop: "10px" }}>
                  <Link to={`/progress/${course.id}`}>
                    <button>View Progress</button>
                  </Link>

                  <Link to={`/quiz/${course.id}`}>
                    <button style={{ marginLeft: "10px" }}>
                      Take Quiz
                    </button>
                  </Link>

                  {p.completed && (
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => downloadCertificate(course.id)}
                    >
                      Download Certificate
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

