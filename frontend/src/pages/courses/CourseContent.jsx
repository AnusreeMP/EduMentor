import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function CourseContent() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [openModuleId, setOpenModuleId] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get(`/courses/${courseId}/modules/`);
        setModules(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchModules();
  }, [courseId]);

  const toggleModule = (id) => {
    setOpenModuleId(openModuleId === id ? null : id);
  };

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>Course Content</h3>
      <p style={styles.smallText}>
        {modules.length} modules • {totalLessons} lessons
      </p>

      {modules.map((m, index) => (
        <div key={m.id} style={styles.moduleCard}>
          {/* ✅ MODULE HEADER */}
          <div style={styles.moduleHeader} onClick={() => toggleModule(m.id)}>
            <div style={styles.left}>
              <div style={styles.orderBox}>{index + 1}</div>
              <div>
                <p style={styles.moduleTitle}>{m.title}</p>
              </div>
            </div>

            <div style={styles.right}>
              <span style={styles.lessonCount}>
                {m.lessons?.length || 0} lessons
              </span>
              <span style={styles.arrow}>
                {openModuleId === m.id ? "⌄" : "›"}
              </span>
            </div>
          </div>

          {/* ✅ LESSON LIST */}
          {openModuleId === m.id && (
            <div style={styles.lessonList}>
              {m.lessons?.length === 0 ? (
                <p style={styles.emptyText}>No lessons added yet.</p>
              ) : (
                m.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/courses/${courseId}/modules/${m.id}/lessons/${lesson.id}`}
                    style={styles.lessonItem}
                  >
                    <div style={styles.lessonLeft}>
                      <span style={styles.playIcon}>▶</span>
                      <span>{lesson.title}</span>
                    </div>

                    <div style={styles.lessonRight}>
                      {lesson.duration ? lesson.duration : "—"}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: { padding: "20px" },
  heading: { fontSize: "22px", fontWeight: 700 },
  smallText: { color: "#6b7280", marginTop: "5px" },

  moduleCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    marginTop: "18px",
    overflow: "hidden",
  },

  moduleHeader: {
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  left: { display: "flex", alignItems: "center", gap: "12px" },
  orderBox: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },

  moduleTitle: { margin: 0, fontWeight: 600, fontSize: "16px" },

  right: { display: "flex", alignItems: "center", gap: "10px" },
  lessonCount: { color: "#6b7280", fontSize: "14px" },
  arrow: { fontSize: "22px", color: "#6b7280" },

  lessonList: { borderTop: "1px solid #e5e7eb" },

  lessonItem: {
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    textDecoration: "none",
    color: "#111827",
    borderBottom: "1px solid #f3f4f6",
  },

  lessonLeft: { display: "flex", alignItems: "center", gap: "10px" },
  playIcon: { color: "#2563eb", fontWeight: 700 },

  lessonRight: { color: "#6b7280", fontSize: "14px" },

  emptyText: { padding: "14px 18px", color: "#6b7280" },
};
