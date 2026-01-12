import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminCourses,
  deleteCourse as deleteAdminCourse,
} from "../../../api/courses";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getAdminCourses(); // ✅ admin API
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteAdminCourse(id); // ✅ admin API
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Manage Courses</h2>
        <Link to="/admin/courses/add" style={styles.addBtn}>
          + Add Course
        </Link>
      </div>

      {/* TABLE */}
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th style={{ width: "220px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.description || "—"}</td>

                {/* ✅ FIXED ACTIONS CELL */}
                <td style={styles.actions}>
                  <Link
                    to={`/admin/courses/${course.id}/edit`}
                    style={styles.editBtn}
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/admin/courses/${course.id}/modules`}
                    style={styles.modulesBtn}
                  >
                    Modules
                  </Link>

                  <button
                    onClick={() => handleDelete(course.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  addBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "500",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },

  /* ✅ ADDED (YOU WERE USING IT) */
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  editBtn: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },

  modulesBtn: {
    background: "#0ea5e9",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
  },

  deleteBtn: {
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontWeight: "500",
  },
};
