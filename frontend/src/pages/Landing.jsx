import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

/* ✅ SAME THUMBNAIL LOGIC AS COURSES.JSX */
function getCourseImage(course) {
  const title = (course?.title || "").toLowerCase();

  const djangoImg =
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=60";
  const pythonImg =
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&auto=format&fit=crop&q=60";
  const defaultImg =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=60";

  return (
    course?.thumbnail ||
    (title.includes("django")
      ? djangoImg
      : title.includes("python")
      ? pythonImg
      : defaultImg)
  );
}

/* ✅ UPCOMING COURSES IMAGES (NO DUPLICATES ✅) */
function getUpcomingImage(title) {
  const t = (title || "").toLowerCase();

  // ✅ Unique images only (no repeat)
  const map = {
    "digital marketing":
      "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&auto=format&fit=crop&q=60",
    "generative ai":
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60",
    cybersecurity:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=60",
    "cloud computing":
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=60",
    "ui ux design":
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&auto=format&fit=crop&q=60",
    "data analytics":
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=60",
  };

  // ✅ direct match by key
  for (const key of Object.keys(map)) {
    if (t.includes(key)) return map[key];
  }

  // ✅ fallback unique image
  return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=60";
}

export default function Landing() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useContext(ThemeContext);
  const { auth } = useAuth();

  const [myCourses, setMyCourses] = useState([]);
  const [loadingMyCourses, setLoadingMyCourses] = useState(false);

  const theme = {
    pageBg: dark ? "#0b1220" : "#ffffff",
    sectionBg: dark ? "#0f172a" : "#f8fafc",
    cardBg: dark ? "#0f172a" : "#ffffff",
    textPrimary: dark ? "#e5e7eb" : "#0f172a",
    textSecondary: dark ? "#94a3b8" : "#475569",
    border: dark ? "#1f2937" : "#e2e8f0",

    primary: "#4f46e5",
    soft: dark ? "rgba(79,70,229,0.18)" : "rgba(79,70,229,0.10)",
  };

  const testimonials = [
    {
      name: "Anjali S",
      role: "Backend Learner",
      img: "https://i.pravatar.cc/150?img=47",
      text: "The structured learning path helped me gain confidence in backend development.",
    },
    {
      name: "Rahul K",
      role: "Full Stack Student",
      img: "https://i.pravatar.cc/150?img=12",
      text: "Assessments and progress tracking made learning consistent and effective.",
    },
    {
      name: "Sneha P",
      role: "Python Developer",
      img: "https://i.pravatar.cc/150?img=32",
      text: "Completing courses and earning certificates motivated me to keep learning.",
    },
  ];

  // ✅ Fetch My Courses only if logged in
  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!auth?.isAuthenticated) return;

      setLoadingMyCourses(true);
      try {
        const res = await api.get("/my-enrollments/");
        const list = (res.data || []).map((x) => x.course);
        setMyCourses(list.slice(0, 4));
      } catch (err) {
        console.log("My courses fetch error:", err);
      } finally {
        setLoadingMyCourses(false);
      }
    };

    fetchMyCourses();
  }, [auth?.isAuthenticated]);

  /* ✅ UPCOMING COURSES LIST */
  const upcomingCourses = [
    { title: "Digital Marketing", icon: "📢" },
    { title: "Generative AI", icon: "🧠" },
    { title: "Cybersecurity", icon: "🔐" },
    { title: "Cloud Computing", icon: "☁️" },
    { title: "UI UX Design", icon: "🎨" },
    { title: "Data Analytics", icon: "📈" },
  ];

  return (
    <div
      style={{
        background: theme.pageBg,
        color: theme.textPrimary,
        transition: "0.3s ease",
        minHeight: "100vh",
      }}
    >
      {/* ✅ theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          ...styles.themeBtn,
          color: theme.textPrimary,
          borderColor: theme.border,
        }}
      >
        {dark ? "☀ Light" : "🌙 Dark"}
      </button>

      {/* ================= HERO ================= */}
      <section
        style={{
          ...styles.hero,
          background: dark
            ? `radial-gradient(circle at top, ${theme.soft}, transparent 55%), linear-gradient(180deg, #0b1220, #0f172a)`
            : `radial-gradient(circle at top, ${theme.soft}, transparent 55%), linear-gradient(180deg, #ffffff, #f8fafc)`,
        }}
      >
        <div style={styles.heroWrap}>
          <div style={styles.heroLeft}>
            <div
              style={{
                ...styles.kicker,
                borderColor: theme.border,
                color: theme.textSecondary,
              }}
            >
              🎓 Modern Learning Platform
            </div>

            <h1 style={{ ...styles.heroTitle, color: theme.textPrimary }}>
              Learn practical skills for a <br /> stronger career.
            </h1>

            <p style={{ ...styles.heroText, color: theme.textSecondary }}>
              EduMentor helps you learn step‑by‑step through structured courses,
              modules, lessons, quizzes, and progress tracking — just like a real
              professional LMS.
            </p>

            <div style={styles.heroButtons}>
              <Link
                to="/courses"
                style={{ ...styles.primaryBtn, background: theme.primary }}
              >
                Browse Courses →
              </Link>

              {!auth?.isAuthenticated ? (
                <Link
                  to="/register"
                  style={{
                    ...styles.secondaryBtn,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                >
                  Create Account
                </Link>
              ) : (
                <button
                  style={{
                    ...styles.secondaryBtn,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/student/dashboard")}
                >
                  Go to Dashboard
                </button>
              )}
            </div>

            <div style={styles.miniStatsRow}>
              <MiniStat label="Courses" value="120+" theme={theme} />
              <MiniStat label="Learners" value="10K+" theme={theme} />
              <MiniStat label="Completion" value="85%" theme={theme} />
            </div>
          </div>

          {/* ✅ right card */}
          <div style={styles.heroRight}>
            <div
              style={{
                ...styles.heroCard,
                background: theme.cardBg,
                borderColor: theme.border,
              }}
            >
              <h3 style={{ margin: 0, fontWeight: 900, color: theme.textPrimary }}>
                Your Learning, Organized ✅
              </h3>

              <p
                style={{
                  marginTop: 8,
                  color: theme.textSecondary,
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                Modules, lessons, quizzes, progress, and certificates — all in one place.
              </p>

              <div style={styles.heroCardList}>
                <FeatureLine text="📌 Structured modules & lessons" theme={theme} />
                <FeatureLine text="📝 Quizzes + pass tracking" theme={theme} />
                <FeatureLine text="📈 Progress dashboard" theme={theme} />
                <FeatureLine text="🎓 Certificates on completion" theme={theme} />
              </div>

              <button
                style={{ ...styles.heroCardBtn, background: theme.primary }}
                onClick={() => navigate("/courses")}
              >
                Start Learning Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MY COURSES ================= */}
      {auth?.isAuthenticated && (
        <section style={{ ...styles.section, background: theme.sectionBg }}>
          <div style={styles.sectionTop}>
            <h2 style={{ ...styles.sectionTitle, color: theme.textPrimary }}>
              My Courses
            </h2>

            <button
              onClick={() => navigate("/courses")}
              style={{
                ...styles.smallBtn,
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
            >
              View All →
            </button>
          </div>

          {loadingMyCourses ? (
            <p style={{ color: theme.textSecondary }}>Loading your courses...</p>
          ) : myCourses.length === 0 ? (
            <div
              style={{
                ...styles.emptyBox,
                background: theme.cardBg,
                borderColor: theme.border,
              }}
            >
              <p style={{ margin: 0, fontWeight: 800, color: theme.textPrimary }}>
                You haven’t enrolled in any course yet.
              </p>
              <p style={{ marginTop: 6, color: theme.textSecondary, fontWeight: 600 }}>
                Explore courses and start learning today 🚀
              </p>
              <button
                onClick={() => navigate("/courses")}
                style={{
                  ...styles.primaryBtn,
                  background: theme.primary,
                  marginTop: 10,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Explore Courses →
              </button>
            </div>
          ) : (
            <div style={styles.courseGrid}>
              {myCourses.map((c) => (
                <CourseMiniCard
                  key={c.id}
                  course={c}
                  theme={theme}
                  onClick={() => navigate(`/courses/${c.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= UPCOMING COURSES ================= */}
      <section style={styles.section}>
        <div style={styles.sectionTop}>
          <h2 style={{ ...styles.sectionTitle, color: theme.textPrimary }}>
            Upcoming Courses
          </h2>
          <p style={{ ...styles.sectionSub, color: theme.textSecondary }}>
            These courses will be available soon 🚀
          </p>
        </div>

        <div style={styles.programs}>
          {upcomingCourses.map((p) => (
            <UpcomingCourseCard
              key={p.title}
              title={p.title}
              icon={p.icon}
              img={getUpcomingImage(p.title)}
              theme={theme}
            />
          ))}
        </div>
      </section>

      {/* ================= SUCCESS ================= */}
      <section style={{ ...styles.section, background: theme.sectionBg }}>
        <div style={styles.sectionTop}>
          <h2 style={{ ...styles.sectionTitle, color: theme.textPrimary }}>
            Learner Success
          </h2>
          <p style={{ ...styles.sectionSub, color: theme.textSecondary }}>
            Real stories from students who improved their skills 💬
          </p>
        </div>

        <div style={styles.testimonials}>
          {testimonials.map((t) => (
            <Testimonial
              key={t.name}
              name={t.name}
              role={t.role}
              img={t.img}
              text={t.text}
              theme={theme}
            />
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section style={{ ...styles.cta, background: theme.primary }}>
        <h2 style={styles.ctaTitle}>Start Learning with EduMentor</h2>
        <p style={styles.ctaText}>
          Build skills, finish courses, and track your progress professionally.
        </p>

        <Link
          to={auth?.isAuthenticated ? "/courses" : "/register"}
          style={{ ...styles.ctaBtn }}
        >
          {auth?.isAuthenticated ? "Browse Courses →" : "Create Free Account →"}
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={{ ...styles.footer, borderTop: `1px solid ${theme.border}` }}>
        <div style={styles.footerGrid}>
          <FooterColumn title="EduMentor" items={["About Us", "Vision", "Careers"]} />
          <FooterColumn title="Programs" items={["Courses", "Certifications", "Skill Paths"]} />
          <FooterColumn title="Support" items={["Help Center", "Contact Us", "FAQs"]} />
          <FooterColumn title="Legal" items={["Privacy Policy", "Terms of Service"]} />
        </div>

        <p style={styles.footerText}>
          © {new Date().getFullYear()} EduMentor. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function MiniStat({ label, value, theme }) {
  return (
    <div style={{ ...styles.miniStat, background: theme.cardBg, borderColor: theme.border }}>
      <p style={{ margin: 0, color: theme.textSecondary, fontWeight: 800, fontSize: 12 }}>{label}</p>
      <p style={{ margin: "6px 0 0", color: theme.textPrimary, fontWeight: 900, fontSize: 18 }}>{value}</p>
    </div>
  );
}

function FeatureLine({ text, theme }) {
  return (
    <div style={{ ...styles.featureLine, borderColor: theme.border, color: theme.textSecondary }}>
      {text}
    </div>
  );
}

function CourseMiniCard({ course, onClick, theme }) {
  return (
    <div
      onClick={onClick}
      style={{ ...styles.courseCard, background: theme.cardBg, borderColor: theme.border }}
    >
      <img src={getCourseImage(course)} alt={course.title} style={styles.courseImg} />
      <div style={{ padding: 14 }}>
        <h4 style={{ margin: 0, fontWeight: 900, color: theme.textPrimary }}>{course.title}</h4>
        <p style={{ marginTop: 6, color: theme.textSecondary, fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>
          {(course.description || "No description").slice(0, 70)}...
        </p>
        <div style={{ marginTop: 10 }}>
          <span style={{ ...styles.courseBtn, color: theme.textPrimary, borderColor: theme.border }}>
            Open →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ✅ NEW UPCOMING CARD WITH IMAGE */
function UpcomingCourseCard({ title, icon, img, theme }) {
  return (
    <div style={{ ...styles.programCard, background: theme.cardBg, borderColor: theme.border }}>
      <img
        src={img}
        alt={title}
        style={{
          width: "100%",
          height: "140px",
          borderRadius: "14px",
          objectFit: "cover",
          border: `1px solid ${theme.border}`,
        }}
      />
      <div style={{ marginTop: 12, fontSize: 22 }}>{icon}</div>
      <p style={{ marginTop: 10, fontWeight: 900, color: theme.textPrimary }}>{title}</p>
      <p style={{ marginTop: 6, color: theme.textSecondary, fontWeight: 600, fontSize: 13 }}>
        Coming soon with modules + quizzes.
      </p>
      <span
        style={{
          display: "inline-block",
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: 12,
          fontWeight: 900,
          fontSize: 13,
          background: theme.soft,
          color: theme.textPrimary,
          border: `1px solid ${theme.border}`,
        }}
      >
        ⏳ Upcoming
      </span>
    </div>
  );
}

function Testimonial({ name, role, img, text, theme }) {
  return (
    <div style={{ ...styles.testimonialCard, background: theme.cardBg, borderColor: theme.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={img} alt={name} style={styles.avatar} />
        <div>
          <h4 style={{ margin: 0, color: theme.textPrimary, fontWeight: 900 }}>{name}</h4>
          <p style={{ marginTop: 2, color: theme.textSecondary, fontWeight: 700, fontSize: 13 }}>
            {role}
          </p>
        </div>
      </div>

      <p style={{ marginTop: 14, color: theme.textSecondary, fontWeight: 600, lineHeight: 1.6 }}>
        “{text}”
      </p>
    </div>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h4 style={styles.footerTitle}>{title}</h4>
      {items.map((item, i) => (
        <p key={i} style={styles.footerItem}>
          {item}
        </p>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  themeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "8px 14px",
    borderRadius: "12px",
    border: "1px solid",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 800,
    zIndex: 10,
  },

  hero: { padding: "90px 24px 40px" },

  heroWrap: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "18px",
    alignItems: "start",
  },

  heroLeft: { padding: "10px" },

  kicker: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid",
    fontWeight: 900,
    fontSize: "12px",
    marginBottom: 14,
  },

  heroTitle: { fontSize: "44px", fontWeight: "900", lineHeight: 1.1, margin: 0 },

  heroText: {
    marginTop: 18,
    fontSize: "15px",
    lineHeight: 1.7,
    maxWidth: "620px",
    fontWeight: 600,
  },

  heroButtons: { display: "flex", gap: "12px", marginTop: 22, flexWrap: "wrap" },

  primaryBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "900",
    color: "white",
    display: "inline-block",
  },

  secondaryBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "900",
    border: "1px solid",
    background: "transparent",
  },

  miniStatsRow: { display: "flex", gap: "12px", marginTop: 18, flexWrap: "wrap" },

  miniStat: {
    padding: "12px 14px",
    borderRadius: "16px",
    border: "1px solid",
    minWidth: "130px",
    boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
  },

  heroRight: { display: "flex" },

  heroCard: {
    width: "100%",
    borderRadius: "22px",
    border: "1px solid",
    padding: "18px",
    boxShadow: "0 18px 45px rgba(2,6,23,0.10)",
  },

  heroCardList: { marginTop: 12, display: "flex", flexDirection: "column", gap: 10 },

  featureLine: {
    border: "1px solid",
    borderRadius: "14px",
    padding: "10px 12px",
    fontWeight: 700,
    fontSize: "13px",
  },

  heroCardBtn: {
    width: "100%",
    border: "none",
    marginTop: 14,
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: 900,
    color: "white",
    cursor: "pointer",
  },

  section: { padding: "56px 24px" },

  sectionTop: {
    maxWidth: "1100px",
    margin: "0 auto 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  sectionTitle: { margin: 0, fontSize: "22px", fontWeight: "900" },
  sectionSub: { margin: 0, fontWeight: 700, fontSize: 13 },

  smallBtn: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 900,
  },

  emptyBox: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: 18,
    borderRadius: 18,
    border: "1px solid",
    boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
  },

  courseGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },

  courseCard: {
    borderRadius: 18,
    border: "1px solid",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(2,6,23,0.08)",
    transition: "0.2s",
  },

  courseImg: { width: "100%", height: 150, objectFit: "cover", display: "block" },

  courseBtn: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid",
    fontWeight: 900,
  },

  programs: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "16px",
  },

  programCard: {
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid",
    boxShadow: "0 18px 40px rgba(2,6,23,0.06)",
  },

  testimonials: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "16px",
  },

  testimonialCard: {
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid",
    boxShadow: "0 18px 40px rgba(2,6,23,0.06)",
  },

  avatar: { width: 46, height: 46, borderRadius: 16, objectFit: "cover" },

  cta: { padding: "56px 24px", color: "white", textAlign: "center" },

  ctaTitle: { margin: 0, fontSize: 26, fontWeight: 900 },
  ctaText: { marginTop: 10, opacity: 0.9, fontWeight: 700 },

  ctaBtn: {
    display: "inline-block",
    marginTop: 16,
    padding: "12px 18px",
    borderRadius: "14px",
    background: "white",
    color: "#0f172a",
    textDecoration: "none",
    fontWeight: 900,
  },

  footer: { padding: "50px 24px", background: "#0b1220", color: "#cbd5e1" },

  footerGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: "24px",
  },

  footerTitle: { fontWeight: "900", color: "#fff" },
  footerItem: { fontSize: "14px", marginTop: 8 },

  footerText: { textAlign: "center", marginTop: 24, fontSize: "13px", opacity: 0.9 },
};
