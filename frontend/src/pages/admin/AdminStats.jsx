import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminStats() {
  const [djangoStats, setDjangoStats] = useState(null);
  const [pythonStats, setPythonStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Django course_id = 8
        const djangoRes = await api.get("/courses/8/stats/");
        setDjangoStats(djangoRes.data);

        // ✅ Python course_id = 7
        const pythonRes = await api.get("/courses/7/stats/");
        setPythonStats(pythonRes.data);
      } catch (err) {
        console.log("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading stats...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Admin Dashboard Stats</h2>

      {/* Django */}
      {djangoStats && (
        <div style={cardStyle}>
          <h3>Django Course (ID: {djangoStats.course_id})</h3>
          <p>Total Attempts: {djangoStats.total_attempts}</p>
          <p>Passed: {djangoStats.passed}</p>
          <p>Failed: {djangoStats.failed}</p>
          <p>Pass Percentage: {djangoStats.pass_percentage}%</p>
        </div>
      )}

      {/* Python */}
      {pythonStats && (
        <div style={cardStyle}>
          <h3>Python Course (ID: {pythonStats.course_id})</h3>
          <p>Total Attempts: {pythonStats.total_attempts}</p>
          <p>Passed: {pythonStats.passed}</p>
          <p>Failed: {pythonStats.failed}</p>
          <p>Pass Percentage: {pythonStats.pass_percentage}%</p>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "18px",
  borderRadius: "10px",
  marginTop: "15px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
};
