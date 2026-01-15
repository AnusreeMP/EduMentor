import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CoursePage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ UI states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Programming", "Data Science", "Design", "Marketing"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/");
        setCourses(res.data || []);
      } catch (err) {
        console.log("Course fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ✅ FILTER + SEARCH (Smart)
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    // ✅ Category filter (works even without backend category)
    if (category !== "All") {
      const cat = category.toLowerCase();

      list = list.filter((c) => {
        const title = (c.title || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        const text = `${title} ${desc}`.trim();

        // 1) If backend has category field
        if ((c.category || "").toLowerCase() === cat) return true;

        // 2) Keyword based category filter
        if (cat === "programming")
          return (
            text.includes("python") ||
            text.includes("django") ||
            text.includes("java") ||
            text.includes("c++") ||
            text.includes("web") ||
            text.includes("react") ||
            text.includes("javascript") ||
            text.includes("node")
          );

        if (cat === "data science")
          return (
            text.includes("data") ||
            text.includes("machine learning") ||
            text.includes("ml") ||
            text.includes("ai") ||
            text.includes("analytics") ||
            text.includes("statistics")
          );

        if (cat === "design")
          return (
            text.includes("ui") ||
            text.includes("ux") ||
            text.includes("design") ||
            text.includes("figma")
          );

        if (cat === "marketing")
          return text.includes("marketing") || text.includes("seo") || text.includes("digital");

        return false;
      });
    }

    // ✅ Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        const title = (c.title || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    return list;
  }, [courses, category, search]);

  if (loading) return <p style={{ padding: "30px" }}>Loading courses...</p>;

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Explore Courses</h2>
        <p style={styles.subTitle}>
          Find the perfect course to advance your skills
        </p>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search for courses, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left Filters */}
        <div style={styles.filtersCard}>
          <div style={styles.filterHeader}>
            <span style={{ fontSize: "18px" }}>⚙️</span>
            <h3 style={{ margin: 0 }}>Filters</h3>
          </div>

          <div style={styles.filterSection}>
            <p style={styles.filterLabel}>Category</p>

            {categories.map((cat) => (
              <label key={cat} style={styles.radioRow}>
                <input
                  type="radio"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
                <span style={{ marginLeft: "10px" }}>{cat}</span>
              </label>
            ))}

            {/* ✅ Clear */}
            <button
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              style={styles.clearBtn}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Right Cards */}
        <div style={styles.content}>
          <p style={styles.countText}>
            Showing <b>{filteredCourses.length}</b> courses
          </p>

          <div style={styles.grid}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ Tags generator */
function generateTagsFromCourse(course) {
  const text = `${course.title || ""} ${course.description || ""}`.toLowerCase();
  const tags = [];
  const add = (t) => !tags.includes(t) && tags.push(t);

  if (text.includes("python")) add("Python");
  if (text.includes("django")) add("Django");
  if (text.includes("react")) add("React");
  if (text.includes("javascript") || text.includes("js")) add("JavaScript");
  if (text.includes("node")) add("Node.js");
  if (text.includes("api")) add("API");
  if (text.includes("database") || text.includes("sql")) add("Database");
  if (text.includes("machine learning") || text.includes("ml")) add("ML");
  if (text.includes("data")) add("Data");
  if (text.includes("ui") || text.includes("ux")) add("UI/UX");

  return tags.slice(0, 3);
}

/* ✅ Course Card (Django/Python separate image) */
function CourseCard({ course, onClick }) {
  const title = (course.title || "").toLowerCase();

  const djangoImg =
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=60";
  const pythonImg =
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&auto=format&fit=crop&q=60";
  const defaultImg =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=60";

  const img =
    course.thumbnail ||
    (title.includes("django") ? djangoImg : title.includes("python") ? pythonImg : defaultImg);

  const rating = course.rating || 4.8;
  const reviews = course.reviews_count || 1000;
  const weeks = course.duration_weeks || 12;

  const badge = course.category || "Course";

  const tagsFromBackend =
    Array.isArray(course.tags) && course.tags.length > 0 ? course.tags : null;

  const tags = tagsFromBackend ? tagsFromBackend.slice(0, 3) : generateTagsFromCourse(course);

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.cardImgWrap}>
        <img src={img} alt={course.title} style={styles.cardImg} />
        <span style={styles.badge}>{badge}</span>
      </div>

      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{course.title}</h3>

        <div style={styles.metaRow}>
          <span style={styles.metaItem}>
            ⭐ {rating} <span style={styles.metaSub}>({reviews})</span>
          </span>
          <span style={styles.metaItem}>🕒 {weeks} weeks</span>
        </div>

        <div style={styles.tagRow}>
          {tags.length === 0 ? (
            <span style={styles.noTag}>No tags</span>
          ) : (
            tags.map((t) => (
              <span style={styles.tag} key={t}>
                {t}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
<div className="pt-20">
  ...
</div>


/* ===== Styles ===== */
const styles = {
  page: { padding: "30px", background: "#f5f9ff", minHeight: "100vh" },

  header: { marginBottom: "18px" },
  title: { fontSize: "30px", fontWeight: "800", margin: 0, color: "#0f172a" },
  subTitle: { marginTop: "6px", color: "#64748b", fontSize: "15px" },

  searchWrap: { marginTop: "18px", marginBottom: "22px" },
  searchBox: {
    background: "#fff",
    borderRadius: "16px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    maxWidth: "780px",
  },
  searchIcon: { fontSize: "18px", color: "#64748b" },
  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#0f172a",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "24px",
    alignItems: "start",
  },

  filtersCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  filterHeader: { display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" },
  filterSection: { marginTop: "14px" },
  filterLabel: { fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" },
  radioRow: { display: "flex", alignItems: "center", padding: "6px 0", color: "#334155", fontSize: "14px" },

  clearBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  content: { width: "100%" },
  countText: { color: "#334155", marginBottom: "16px" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" },

  card: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  cardImgWrap: { position: "relative" },
  cardImg: { width: "100%", height: "190px", objectFit: "cover", display: "block" },
  badge: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "white",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
  },

  cardBody: { padding: "16px 18px 18px" },
  cardTitle: { fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px 0" },

  metaRow: { display: "flex", gap: "16px", alignItems: "center", fontSize: "14px", color: "#334155", marginBottom: "14px" },
  metaItem: { display: "flex", gap: "6px", alignItems: "center" },
  metaSub: { color: "#64748b" },

  tagRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  tag: { background: "#eaf2ff", color: "#2563eb", fontSize: "13px", padding: "6px 12px", borderRadius: "999px", fontWeight: "700" },
  noTag: { color: "#64748b", fontSize: "13px" },
};
