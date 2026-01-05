import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function ModuleDetail() {
  const { courseId, moduleId } = useParams();

  const [module, setModule] = useState(null);
  const [videos, setVideos] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const moduleRes = await api.get(
          `/courses/${courseId}/modules/${moduleId}/`
        );
        setModule(moduleRes.data);

        const videoRes = await api.get(
          `/modules/${moduleId}/videos/`
        );
        setVideos(videoRes.data);

        try {
          const quizRes = await api.get(
            `/modules/${moduleId}/quiz/`
          );
          setQuiz(quizRes.data);
        } catch {
          setQuiz(null);
        }
      } catch (err) {
        console.error(err);
        setError("Module not found or access denied");
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [courseId, moduleId]);

  if (loading) return <p>Loading module...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{module.title}</h2>
      <p>{module.description}</p>

      <hr />

      {/* 🎥 VIDEOS */}
      <h3 className="mb-4">📘 Module Videos</h3>

      {videos.length === 0 && (
        <div className="alert alert-info">
          No videos added yet.
        </div>
      )}

      <div className="row">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4"
          >
            <div className="card h-100 shadow-sm border-0">

              {/* 🎬 Video */}
              <div className="ratio ratio-16x9">
                <iframe
                  src={video.video_url}
                  title={video.title}
                  allowFullScreen
                />
              </div>

              {/* 📄 Card Body */}
              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-bold">
                  {index + 1}. {video.title}
                </h6>

                <p className="card-text text-muted small mb-2">
                  Duration: {video.duration} seconds
                </p>

                {/* 🔖 Status Badge */}
                <div className="mt-auto">
                  <span className="badge bg-secondary">
                    Not Completed
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>


      <hr />

      {/* 📝 QUIZ */}
      <h3>Quiz</h3>

      {!quiz && <p>No quiz available for this module.</p>}

      {quiz && quiz.id && (
        <div>
          <p><strong>{quiz.title}</strong></p>
          <p>
            Pass Marks: {quiz.pass_marks} / {quiz.total_marks}
          </p>

          <Link to={`/courses/${courseId}/modules/${moduleId}/quiz`}>
            <button>Take Quiz</button>
          </Link>

        </div>
      )}
    </div>
  );
}
