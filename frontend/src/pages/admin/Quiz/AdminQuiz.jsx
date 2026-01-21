import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getModuleQuiz,
  createModuleQuiz,
  getQuizQuestions,
} from "../../../api/quiz";

export default function AdminQuiz() {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizAndQuestions = async () => {
    try {
      setLoading(true);

      // ✅ Fetch quiz of this module
      const quizRes = await getModuleQuiz(moduleId);
      const quizData = quizRes.data;

      setQuiz(quizData);

      // ✅ Fetch questions of quiz
      if (quizData?.id) {
        const qRes = await getQuizQuestions(quizData.id);
        setQuestions(qRes.data || []);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.log("Module quiz fetch error:", err?.response?.data || err);
      setQuiz(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizAndQuestions();
    // eslint-disable-next-line
  }, [moduleId]);

  const handleCreateQuiz = async () => {
    try {
      await createModuleQuiz(moduleId);
      alert("✅ Quiz created!");
      fetchQuizAndQuestions();
    } catch (err) {
      console.log("Create quiz error:", err?.response?.data || err);
      alert("❌ Failed to create quiz");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ Header */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>📝 Module Quiz</h2>
            <p style={styles.subtitle}>
              Course: <b>{courseId}</b> | Module: <b>{moduleId}</b>
            </p>
          </div>

          <div style={styles.headerBtns}>
            <button
              style={styles.backBtn}
              onClick={() => navigate(`/admin/courses/${courseId}/modules`)}
            >
              ← Back
            </button>

            {quiz?.id && (
              <Link to={`add/${quiz.id}`} style={styles.addBtn}>
                ➕ Add Question
              </Link>
            )}

            <button style={styles.refreshBtn} onClick={fetchQuizAndQuestions}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* ✅ If no quiz exists */}
        {!loading && !quiz?.id && (
          <div style={styles.infoBox}>
            <p style={styles.infoText}>❌ No quiz found for this module.</p>
            <button style={styles.createBtn} onClick={handleCreateQuiz}>
              ✅ Create Quiz Now
            </button>
          </div>
        )}

        {/* ✅ Loading */}
        {loading ? (
          <p style={styles.loadingText}>Loading quiz...</p>
        ) : quiz?.id && questions.length === 0 ? (
          <p style={styles.emptyText}>No questions added yet.</p>
        ) : questions.length > 0 ? (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Question</th>
                  <th style={{ ...styles.th, width: 200 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {questions.map((q, index) => (
                  <tr key={q.id} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.tdTitle}>{q.question}</td>

                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        <Link
                          to={`edit/${q.id}`}
                          style={styles.editBtn}
                        >
                          ✏️ Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <p style={styles.note}>
          ✅ Tip: Add at least <b>5 questions</b> for a good quiz.
        </p>
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
      "radial-gradient(circle at top, rgba(79,70,229,0.16), transparent 50%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },
  card: {
    width: "100%",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
    backdropFilter: "blur(10px)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: { margin: 0, fontSize: "24px", fontWeight: 900, color: "#0f172a" },
  subtitle: { marginTop: 6, marginBottom: 0, fontSize: 13, fontWeight: 700, color: "#64748b" },
  headerBtns: { display: "flex", gap: 10, flexWrap: "wrap" },
  backBtn: {
    border: "none",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  addBtn: {
    textDecoration: "none",
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    boxShadow: "0 16px 30px rgba(22,163,74,0.18)",
  },
  refreshBtn: {
    border: "none",
    background: "#0ea5e9",
    color: "white",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(14,165,233,0.18)",
  },
  loadingText: { fontWeight: 900, color: "#475569" },
  emptyText: { fontWeight: 800, color: "#64748b" },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    background: "white",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "800px" },
  th: {
    textAlign: "left",
    padding: "14px",
    fontSize: "13px",
    fontWeight: 900,
    color: "#334155",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: 14, fontSize: 14, fontWeight: 700, color: "#334155" },
  tdTitle: { padding: 14, fontSize: 14, fontWeight: 900, color: "#0f172a" },
  actionRow: { display: "flex", gap: 10, alignItems: "center" },
  editBtn: {
    textDecoration: "none",
    background: "#4f46e5",
    color: "white",
    padding: "8px 12px",
    borderRadius: "12px",
    fontWeight: 900,
    fontSize: 13,
    boxShadow: "0 10px 20px rgba(79,70,229,0.20)",
  },
  note: { marginTop: 12, fontSize: 13, fontWeight: 700, color: "#64748b" },

  infoBox: {
    border: "1px solid #e2e8f0",
    background: "white",
    borderRadius: "14px",
    padding: "14px",
    marginTop: "12px",
  },
  infoText: { margin: 0, fontWeight: 900, color: "#dc2626" },
  createBtn: {
    marginTop: "10px",
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
};
