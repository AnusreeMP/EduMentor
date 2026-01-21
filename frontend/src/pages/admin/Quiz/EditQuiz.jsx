import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function EditQuiz() {
  const navigate = useNavigate();
  const { courseId, moduleId, questionId } = useParams();

  const goBack = () =>
    navigate(`/admin/courses/${courseId}/modules/${moduleId}/quiz`);

  const [form, setForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Load question from module quiz questions list
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);

        // 1) Get module quiz
        const quizRes = await api.get(`/modules/${moduleId}/quiz/`);
        const quiz = quizRes.data;

        if (!quiz?.id) {
          alert("❌ No quiz found for this module");
          goBack();
          return;
        }

        // 2) Get all questions of that quiz
        const qRes = await api.get(`/quizzes/${quiz.id}/questions/`);
        const questions = qRes.data || [];

        // 3) Find this question
        const found = questions.find((q) => String(q.id) === String(questionId));

        if (!found) {
          alert("❌ Question not found!");
          goBack();
          return;
        }

        // ✅ Set form values
        setForm({
          question: found.question || "",
          option_a: found.option_a || "",
          option_b: found.option_b || "",
          option_c: found.option_c || "",
          option_d: found.option_d || "",
          correct_answer: found.correct_answer || "A",
        });
      } catch (err) {
        console.log("Fetch question error:", err?.response?.data || err);
        alert("❌ Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
    // eslint-disable-next-line
  }, [questionId, moduleId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update question (YOU MUST HAVE BACKEND UPDATE ENDPOINT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        question: form.question,
        option_a: form.option_a,
        option_b: form.option_b,
        option_c: form.option_c,
        option_d: form.option_d,
        correct_answer: form.correct_answer,
      };

      // ✅ Change this URL to your backend edit endpoint
      // Example: /api/admin/quiz/<id>/edit/
      await api.put(`/admin/quiz/${questionId}/edit/`, payload);

      alert("✅ Question Updated!");
      goBack();
    } catch (err) {
      console.log("Update error:", err?.response?.data || err);
      alert(JSON.stringify(err?.response?.data || "❌ Update failed", null, 2));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 30, fontWeight: 900 }}>Loading question...</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>✏️ Edit Quiz Question</h2>
            <p style={styles.subtitle}>
              Course: <b>{courseId}</b> | Module: <b>{moduleId}</b>
            </p>
          </div>

          <button style={styles.backBtn} onClick={goBack}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Question *</label>
            <textarea
              style={styles.textarea}
              name="question"
              value={form.question}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Option A *</label>
              <input
                style={styles.input}
                name="option_a"
                value={form.option_a}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Option B *</label>
              <input
                style={styles.input}
                name="option_b"
                value={form.option_b}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Option C *</label>
              <input
                style={styles.input}
                name="option_c"
                value={form.option_c}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Option D *</label>
              <input
                style={styles.input}
                name="option_d"
                value={form.option_d}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Correct Answer *</label>
            <select
              style={styles.input}
              name="correct_answer"
              value={form.correct_answer}
              onChange={handleChange}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div style={styles.btnRow}>
            <button type="button" style={styles.cancelBtn} onClick={goBack}>
              Cancel
            </button>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Updating..." : "✅ Update Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ✅ Styles */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "26px",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.18), transparent 50%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },
  card: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.12)",
    backdropFilter: "blur(10px)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  title: { margin: 0, fontSize: "24px", fontWeight: 900, color: "#0f172a" },
  subtitle: { margin: 0, marginTop: "6px", fontSize: "13px", fontWeight: 700, color: "#64748b" },
  backBtn: {
    border: "none",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  form: { display: "grid", gap: "14px", marginTop: "10px" },
  field: { display: "grid", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 900, color: "#334155" },
  input: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    fontWeight: 700,
    outline: "none",
    background: "white",
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    fontWeight: 700,
    outline: "none",
    background: "white",
    minHeight: "90px",
    resize: "vertical",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  cancelBtn: {
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#0f172a",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  saveBtn: {
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(79,70,229,0.22)",
  },
};
