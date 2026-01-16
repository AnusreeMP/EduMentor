import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ModuleDetail() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [quiz, setQuiz] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Load module + lessons + quiz
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const moduleRes = await api.get(`/courses/${courseId}/modules/${moduleId}/`);
        setModule(moduleRes.data);

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

  // ✅ Load completed lessons for this module (Coursera feature)
  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.get(`/modules/${moduleId}/completed-lessons/`);
        setCompletedLessonIds(res.data.completed_lesson_ids || []);
      } catch (err) {
        console.log("Completed lessons error:", err);
      }
    };

    fetchCompleted();
  }, [moduleId]);

  const totalLessons = module?.lessons?.length || 0;
  const completedCount = useMemo(() => {
    return module?.lessons?.filter((l) => completedLessonIds.includes(l.id)).length || 0;
  }, [module, completedLessonIds]);

  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  if (loading) return <p>Loading module...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: "800" }}>{module.title}</h2>
      <p style={{ color: "#555" }}>{module.description || "—"}</p>

      {/* ✅ Progress Bar */}
      <div
        style={{
          marginTop: "14px",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Progress</span>
          <span>
            {completedCount}/{totalLessons} ({progressPercent}%)
          </span>
        </div>

        <div
          style={{
            marginTop: "8px",
            height: "10px",
            background: "#e5e7eb",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "#22c55e",
            }}
          />
        </div>
      </div>

      <hr />

      {/* ✅ LESSONS */}
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
            {module.lessons?.map((lesson, index) => {
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    background: selectedLesson?.id === lesson.id ? "#f0f7ff" : "#fff",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        background: isDone ? "#22c55e" : "#2563eb",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "800",
                      }}
                    >
                      {isDone ? "✓" : index + 1}
                    </div>

                    <div>
                      <div style={{ fontWeight: "700" }}>{lesson.title}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>Lesson #{lesson.order}</div>
                    </div>
                  </div>

                  {/* ✅ Badge */}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "800",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: isDone ? "#dcfce7" : "#fef9c3",
                      color: isDone ? "#166534" : "#854d0e",
                    }}
                  >
                    {isDone ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: lesson preview */}
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
              {/* ✅ Title + Start Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <h4 style={{ fontWeight: "800", margin: 0 }}>{selectedLesson.title}</h4>

                <button
                  className="btn btn-success"
                  onClick={() => navigate(`/lessons/${selectedLesson.id}`)}
                >
                  Start Lesson →
                </button>
              </div>

              <p style={{ color: "#444", marginTop: "10px" }}>
                {selectedLesson.content || "No lesson content available."}
              </p>

              {/* ✅ Video Preview */}
              {selectedLesson.video_url ? (
                <div style={{ marginTop: "15px" }}>
                  <h6 style={{ fontWeight: "700" }}>🎥 Lesson Video</h6>
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
