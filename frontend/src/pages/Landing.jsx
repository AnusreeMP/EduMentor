import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Landing() {
  const { dark } = useContext(ThemeContext);

  const theme = {
    pageBg: dark ? "#111827" : "#ffffff",
    sectionBg: dark ? "#1f2937" : "#f9fafb",
    cardBg: dark ? "#1f2937" : "#ffffff",
    textPrimary: dark ? "#e5e7eb" : "#111827",
    textSecondary: dark ? "#9ca3af" : "#4b5563",
    border: dark ? "#374151" : "#e5e7eb",
  };

  return (
    <div
      style={{
        background: theme.pageBg,
        color: theme.textPrimary,
        transition: "0.3s ease",
      }}
    >
      {/* ================= HERO ================= */}
      <section
        style={{
          ...styles.hero,
          background: dark
            ? "linear-gradient(135deg, #1f2937 0%, #111827 65%)"
            : styles.hero.background,
        }}
      >
        <div style={styles.heroContent}>
          <h1 style={{ ...styles.heroTitle, color: theme.textPrimary }}>
            Learn Practical Skills for a <br /> Stronger Career
          </h1>

          <p style={{ ...styles.heroText, color: theme.textSecondary }}>
            EduMentor is a structured online learning platform designed to help
            learners build real-world skills through guided courses,
            assessments, and certifications.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/courses" style={styles.primaryBtn}>
              Browse Courses
            </Link>
            <Link to="/register" style={styles.secondaryBtn}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section style={{ ...styles.section, background: theme.sectionBg }}>
        <div style={styles.stats}>
          <Stat number="10,000+" label="Active Learners" theme={theme} />
          <Stat number="120+" label="Skill-Based Courses" theme={theme} />
          <Stat number="85%" label="Completion Rate" theme={theme} />
          <Stat number="90%" label="Learner Satisfaction" theme={theme} />
        </div>
      </section>

      {/* ================= PROGRAMS ================= */}
      <section style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, color: theme.textPrimary }}>
          Learning Programs
        </h2>

        <div style={styles.programs}>
          {[
            "Python & Django Development",
            "Full Stack Web Development",
            "Data Science Fundamentals",
            "Machine Learning Essentials",
            "Backend & Database Systems",
            "Cloud & Deployment Basics",
          ].map((title) => (
            <Program key={title} title={title} theme={theme} />
          ))}
        </div>
      </section>

      {/* ================= SUCCESS ================= */}
      <section style={{ ...styles.section, background: theme.sectionBg }}>
        <h2 style={{ ...styles.sectionTitle, color: theme.textPrimary }}>
          Learner Success
        </h2>

        <div style={styles.testimonials}>
          <Testimonial
            name="Anjali S"
            text="The structured learning path helped me gain confidence in backend development."
            theme={theme}
          />
          <Testimonial
            name="Rahul K"
            text="Assessments and progress tracking made learning consistent and effective."
            theme={theme}
          />
          <Testimonial
            name="Sneha P"
            text="Completing courses and earning certificates motivated me to keep learning."
            theme={theme}
          />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Start Learning with EduMentor</h2>
        <Link to="/register" style={styles.primaryBtn}>
          Create Free Account
        </Link>
      </section>

      {/* ================= FOOTER (UNCHANGED) ================= */}
      <footer style={styles.footer}>
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

/* ================= COMPONENTS ================= */

function Stat({ number, label, theme }) {
  return (
    <div
      style={{
        ...styles.statCard,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h3>{number}</h3>
      <p style={{ color: theme.textSecondary }}>{label}</p>
    </div>
  );
}

function Program({ title, theme }) {
  return (
    <div
      style={{
        ...styles.programCard,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
      }}
    >
      {title}
    </div>
  );
}

function Testimonial({ name, text, theme }) {
  return (
    <div
      style={{
        ...styles.testimonialCard,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
      }}
    >
      <p style={{ color: theme.textSecondary }}>"{text}"</p>
      <h4>— {name}</h4>
    </div>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h4 style={styles.footerTitle}>{title}</h4>
      {items.map((item, i) => (
        <p key={i} style={styles.footerItem}>{item}</p>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  hero: {
    padding: "110px 60px",
    background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 65%)",
  },
  heroContent: { maxWidth: "700px" },
  heroTitle: { fontSize: "42px", fontWeight: "700" },
  heroText: { marginTop: "20px", fontSize: "16px", lineHeight: "1.7" },
  heroButtons: { display: "flex", gap: "18px", marginTop: "34px" },

  section: { padding: "90px 60px", textAlign: "center" },
  sectionTitle: { fontSize: "28px", fontWeight: "700", marginBottom: "50px" },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "24px",
  },
  statCard: {
    padding: "26px",
    borderRadius: "16px",
    fontWeight: "600",
  },

  programs: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "24px",
  },
  programCard: {
    padding: "24px",
    borderRadius: "16px",
    fontWeight: "500",
  },

  testimonials: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "26px",
  },
  testimonialCard: {
    padding: "26px",
    borderRadius: "16px",
  },

  cta: {
    padding: "90px 40px",
    background: "#4f46e5",
    color: "#fff",
    textAlign: "center",
  },
  ctaTitle: { fontSize: "28px", fontWeight: "700", marginBottom: "22px" },

  primaryBtn: {
    padding: "12px 26px",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
  },
  secondaryBtn: {
    padding: "12px 26px",
    border: "2px solid #4f46e5",
    color: "#4f46e5",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
  },

  footer: { background: "#111827", color: "#d1d5db", padding: "70px 60px" },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: "34px",
  },
  footerTitle: { fontWeight: "600", color: "#fff" },
  footerItem: { fontSize: "14px" },
  footerText: { textAlign: "center", marginTop: "30px", fontSize: "13px" },
};
