import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function Progress() {
    const { courseId } = useParams();

    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await api.get(`/courses/${courseId}/progress/`);
                setProgress(res.data);
            } catch (err) {
                console.error(err);
                setError("Progress not available yet");
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [courseId]);

    if (loading) return <p>Loading progress...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Course Progress</h2>

            <p>
                Progress: <strong>{progress.progress}%</strong>
            </p>

            <progress value={progress.progress} max="100" />

            <h3 style={{ marginTop: "20px" }}>Details</h3>

            <ul>
                <li>Videos completed: {progress.videos_completed}</li>
                <li>Total videos: {progress.total_videos}</li>
                <li>Quiz passed: {progress.quiz_passed ? "Yes ✅" : "No ❌"}</li>
            </ul>

            {progress.completed && (
                <p style={{ color: "green", marginTop: "15px" }}>
                    🎉 Course completed! Certificate available.
                </p>
            )}
        </div>
    );
}
