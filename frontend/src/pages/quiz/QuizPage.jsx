import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function QuizPage() {
    const { moduleId, courseId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                // ✅ quiz info (module-based)
                const quizRes = await api.get(`/modules/${moduleId}/quiz/`);
                setQuiz(quizRes.data);

                // ✅ questions (quiz-based)
                const questionRes = await api.get(`/quizzes/${quizRes.data.id}/questions/`);
                setQuestions(questionRes.data);

            } catch (err) {
                console.error(err);
                setError("Quiz not available for this module");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [moduleId]);


    const selectAnswer = (questionId, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const submitQuiz = async () => {
        try {
            const res = await api.post(
                `/modules/${moduleId}/quiz/submit/`,
                { answers }
            );
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert("Quiz submission not allowed yet");
        }
    };

    if (loading) return <p>Loading quiz...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!quiz) return <p>Quiz not available</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>{quiz.title}</h2>
            <p>
                Pass Marks: {quiz.pass_marks} / {quiz.total_marks}
            </p>

            <hr />

            {questions.map((q, index) => (
                <div
                    key={q.id}
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px"
                    }}
                >
                    <p>
                        <strong>
                            {index + 1}. {q.question_text}
                        </strong>
                    </p>

                    {["A", "B", "C", "D"].map(opt => (
                        <label key={opt} style={{ display: "block" }}>
                            <input
                                type="radio"
                                name={`question-${q.id}`}
                                checked={answers[q.id] === opt}
                                onChange={() => selectAnswer(q.id, opt)}
                            />
                            {" "}
                            {q[`option_${opt.toLowerCase()}`]}
                        </label>
                    ))}
                </div>
            ))}

            {!result && (
                <button onClick={submitQuiz}>
                    Submit Quiz
                </button>
            )}

            {result && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Result</h3>
                    <p>Score: {result.score}</p>
                    <p>
                        Status:{" "}
                        <strong style={{ color: result.passed ? "green" : "red" }}>
                            {result.passed ? "PASSED 🎉" : "FAILED ❌"}
                        </strong>
                    </p>

                    <button
                        onClick={() =>
                            navigate(`/courses/${courseId}/modules/${moduleId}`)
                        }
                    >
                        Back to Module
                    </button>
                </div>
            )}
        </div>
    );
}