import { useParams } from "react-router-dom";

export default function EditLesson() {
  const { lessonId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Lesson</h2>
      <p>Lesson ID: {lessonId}</p>

      {/* form will go here later */}
    </div>
  );
}
