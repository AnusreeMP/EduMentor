import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function CourseDetail() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isEnrolled = course?.is_enrolled;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // ✅ Always load course
        const courseRes = await api.get(`/courses/${courseId}/`);
        setCourse(courseRes.data);

        // ✅ Load modules ONLY if enrolled
        if (courseRes.data.is_enrolled) {
          const moduleRes = await api.get(`/courses/${courseId}/modules/`);
          setModules(moduleRes.data);
        } else {
          setModules([]); // locked state
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p className="text-center mt-5">Loading course...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container py-4">

      {/* 🔵 COURSE HEADER */}
      <div
        className="p-4 mb-4 rounded shadow-sm text-white"
        style={{
          background: "linear-gradient(135deg, #0d6efd, #6610f2)"
        }}
      >
        <h2 className="fw-bold">{course.title}</h2>
        <p className="mb-3">{course.description}</p>

        {/* ✅ ENROLL LOGIC */}
        {!isEnrolled ? (
          <button
            className="btn btn-light fw-bold"
            onClick={async () => {
              await api.post(`/courses/${courseId}/enroll/`);
              window.location.reload();
            }}
          >
            Enroll Now
          </button>
        ) : (
          <span className="badge bg-success fs-6">
            ✅ Enrolled
          </span>
        )}
      </div>

      {/* 🔒 WARNING */}
      {!isEnrolled && (
        <div className="alert alert-warning">
          🔒 Please enroll in this course to access the modules.
        </div>
      )}

      {/* 📦 MODULES */}
      <h4 className="mb-4 fw-bold">📘 Course Modules</h4>

      {modules.length === 0 && isEnrolled && (
        <div className="alert alert-info">
          No modules added yet.
        </div>
      )}

      <div className="row">
        {modules.map((module) => (
          <div
            key={module.id}
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4"
          >
            <div className="card h-100 shadow-sm border-0">

              <div
                className="card-header text-white fw-bold"
                style={{ backgroundColor: "#0d6efd" }}
              >
                Module {module.order}
              </div>

              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-bold">
                  {module.title}
                </h6>

                <p className="card-text text-muted small">
                  {module.description}
                </p>

                <Link
                  to={`/courses/${course.id}/modules/${module.id}`}
                  className="btn btn-outline-primary btn-sm mt-auto"
                >
                  Open Module
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 📊 PROGRESS */}
      {isEnrolled && (
        <div className="mt-4">
          <Link to={`/progress/${courseId}`} className="btn btn-success">
            View Course Progress
          </Link>
        </div>
      )}

    </div>
  );
}
