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
      <h3>Videos</h3>

      {videos.length === 0 && <p>No videos added yet.</p>}

      {videos.map(video => (
        <div
          key={video.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h4>
            {video.order}. {video.title}
          </h4>

          <iframe
            width="100%"
            height="400"
            src={video.video_url}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}

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
