import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function LessonDetail() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${lessonId}/`);
        setLesson(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{lesson.title}</h2>
      <p style={{ color: "#6b7280" }}>{lesson.content}</p>

      {lesson.video_url && (
        <div style={{ marginTop: "20px" }}>
          <iframe
            width="100%"
            height="450"
            src={lesson.video_url}
            title={lesson.title}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
