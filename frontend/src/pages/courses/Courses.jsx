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

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📚 Explore Courses</h2>

      <div className="row">
        {courses.map(course => (
          <div
            key={course.id}
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4"
          >
            <div className="card h-100 shadow-sm border-0">

              {/* Course Header */}
              <div
                style={{
                  height: "150px",
                  background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: "bold"
                }}
              >
                {course.title}
              </div>

              {/* Card Body */}
              <div className="card-body d-flex flex-column">
                <p className="text-muted small">
                  {course.description.length > 100
                    ? course.description.slice(0, 100) + "..."
                    : course.description}
                </p>

                <Link
                  to={`/courses/${course.id}`}
                  className="btn btn-primary btn-sm mt-auto"
                >
                  View Course
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
