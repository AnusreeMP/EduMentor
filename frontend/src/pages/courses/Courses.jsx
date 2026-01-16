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

  // ✅ FILTER + SEARCH
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    if (category !== "All") {
      const cat = category.toLowerCase();

      list = list.filter((c) => {
        const title = (c.title || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        const text = `${title} ${desc}`.trim();

        // backend category
        if ((c.category || "").toLowerCase() === cat) return true;

        // keyword filters
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
      {/* ✅ HERO HEADER */}
      <div style={styles.hero}>
        <div>
          <h2 style={styles.heroTitle}>Explore Courses 📚</h2>
          <p style={styles.heroSub}>
            Learn job-ready skills with structured modules and lessons.
          </p>

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

            <div style={styles.countPill}>
              Showing <b>{filteredCourses.length}</b> courses
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Layout */}
      <div style={styles.layout}>
        {/* Left Filters */}
        <div style={styles.filtersCard}>
          <div style={styles.filterHeader}>
            <div style={styles.filterIcon}>⚙️</div>
            <div>
              <h3 style={styles.filterTitle}>Filters</h3>
              <p style={styles.filterSub}>Choose category & search</p>
            </div>
          </div>

          <div style={styles.filterSection}>
            <p style={styles.filterLabel}>Category</p>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  ...styles.catBtn,
                  background: category === cat ? "#4f46e5" : "white",
                  color: category === cat ? "white" : "#0f172a",
                  border: category === cat ? "1px solid #4f46e5" : "1px solid #e2e8f0",
                }}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              style={styles.clearBtn}
            >
              Clear Filters ✨
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div style={styles.content}>
          {filteredCourses.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3 style={{ margin: 0 }}>No courses found 😢</h3>
              <p style={{ marginTop: 8, color: "#64748b", fontWeight: 700 }}>
                Try changing your search or category.
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/courses/${course.id}`)}
                />
              ))}
            </div>
          )}
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

/* ✅ Course Card */
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

        <span
          style={{
            ...styles.typePill,
            background: course.is_premium ? "#fee2e2" : "#dcfce7",
            color: course.is_premium ? "#991b1b" : "#166534",
          }}
        >
          {course.is_premium ? "⭐ Premium" : "✅ Free"}
        </span>
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

        <button style={styles.openBtn}>View Course →</button>
      </div>
    </div>
  );
}

/* ✅ Styles */
const styles = {
  page: {
    padding: "26px",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.14), transparent 45%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  hero: {
    padding: "22px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, rgba(79,70,229,0.92), rgba(124,58,237,0.92))",
    boxShadow: "0 18px 45px rgba(2,6,23,0.18)",
    color: "white",
    marginBottom: "18px",
  },

  heroTitle: { margin: 0, fontSize: "28px", fontWeight: "900" },
  heroSub: { marginTop: "8px", marginBottom: "14px", opacity: 0.9, fontWeight: "600" },

  searchWrap: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  searchBox: {
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "16px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    maxWidth: "620px",
    backdropFilter: "blur(12px)",
  },

  searchIcon: { fontSize: "18px" },
  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "white",
    background: "transparent",
    fontWeight: "600",
  },

  countPill: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.20)",
    border: "1px solid rgba(255,255,255,0.25)",
    fontWeight: "800",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "18px",
    alignItems: "start",
  },

  filtersCard: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
    border: "1px solid rgba(148,163,184,0.25)",
  },

  filterHeader: { display: "flex", gap: "12px", alignItems: "center" },
  filterIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    background: "#A7F3D0",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
    boxShadow: "0 14px 26px rgba(0,0,0,0.10)",
  },
  filterTitle: { margin: 0, fontWeight: "900", color: "#0f172a" },
  filterSub: { margin: "4px 0 0", color: "#64748b", fontWeight: "700", fontSize: "13px" },

  filterSection: { marginTop: "16px" },
  filterLabel: { fontSize: "13px", fontWeight: "900", color: "#0f172a", marginBottom: "10px" },

  catBtn: {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: "14px",
    marginBottom: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  clearBtn: {
    marginTop: "6px",
    width: "100%",
    padding: "11px",
    borderRadius: "14px",
    border: "none",
    background: "#0f172a",
    color: "white",
    fontWeight: "900",
    cursor: "pointer",
  },

  content: { width: "100%" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
  },

  emptyCard: {
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(148,163,184,0.25)",
    boxShadow: "0 18px 40px rgba(2,6,23,0.08)",
  },

  card: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 16px 40px rgba(2,6,23,0.10)",
    border: "1px solid rgba(148,163,184,0.25)",
    transition: "0.2s ease",
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
    fontWeight: "800",
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
  },

  typePill: {
    position: "absolute",
    left: "14px",
    top: "14px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "900",
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
  },

  cardBody: { padding: "16px 18px 18px" },

  cardTitle: { fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: "0 0 10px 0" },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    fontSize: "14px",
    color: "#334155",
    marginBottom: "12px",
    fontWeight: "700",
  },

  metaItem: { display: "flex", gap: "6px", alignItems: "center" },
  metaSub: { color: "#64748b" },

  tagRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" },
  tag: {
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "13px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "800",
  },
  noTag: { color: "#64748b", fontSize: "13px", fontWeight: "800" },

  openBtn: {
    width: "100%",
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "12px",
    borderRadius: "14px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(79,70,229,0.22)",
  },
};
