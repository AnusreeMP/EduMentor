import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function ModuleDetail() {
  const { courseId, moduleId } = useParams();

  const [module, setModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const moduleRes = await api.get(`/courses/${courseId}/modules/${moduleId}/`);
        setModule(moduleRes.data);

        // select first lesson by default
        if (moduleRes.data.lessons && moduleRes.data.lessons.length > 0) {
          setSelectedLesson(moduleRes.data.lessons[0]);
        }

        try {
          const quizRes = await api.get(`/modules/${moduleId}/quiz/`);
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
      <h2 style={{ fontWeight: "700" }}>{module.title}</h2>
      <p style={{ color: "#555" }}>{module.description || "—"}</p>

      <hr />

      {/* ✅ LESSONS UI like Screenshot */}
      <h3 style={{ marginBottom: "15px" }}>📚 Lessons</h3>

      {(!module.lessons || module.lessons.length === 0) && (
        <div className="alert alert-info">No lessons added yet.</div>
      )}

      <div style={{ display: "flex", gap: "20px" }}>
        {/* LEFT: lesson list */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#fff",
              overflow: "hidden",
            }}
          >
            {module.lessons?.map((lesson, index) => (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  background:
                    selectedLesson?.id === lesson.id ? "#f0f7ff" : "#fff",
                }}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                    }}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <div style={{ fontWeight: "600" }}>{lesson.title}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Lesson #{lesson.order}
                    </div>
                  </div>
                </div>

                <span style={{ color: "#999" }}>▶</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: lesson content + video */}
        <div style={{ flex: 1 }}>
          {!selectedLesson ? (
            <p>Select a lesson to view details</p>
          ) : (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                background: "#fff",
              }}
            >
              <h4 style={{ fontWeight: "700" }}>{selectedLesson.title}</h4>

              <p style={{ color: "#444", marginTop: "10px" }}>
                {selectedLesson.content || "No lesson content available."}
              </p>

              {/* ✅ Lesson Video */}
              {selectedLesson.video_url ? (
                <div style={{ marginTop: "15px" }}>
                  <h6 style={{ fontWeight: "600" }}>🎥 Lesson Video</h6>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={selectedLesson.video_url}
                      title={selectedLesson.title}
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    color: "#666",
                  }}
                >
                  No video added for this lesson.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <hr />

      {/* ✅ QUIZ */}
      <h3>📝 Quiz</h3>
      {!quiz && <p>No quiz available for this module.</p>}

      {quiz && quiz.id && (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>{quiz.title}</strong>
          </p>
          <p>
            Pass Marks: {quiz.pass_marks} / {quiz.total_marks}
          </p>

          <Link to={`/courses/${courseId}/modules/${moduleId}/quiz`}>
            <button className="btn btn-primary">Take Quiz</button>
          </Link>
        </div>
      )}
    </div>
  );
}
