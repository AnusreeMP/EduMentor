import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const certRef = useRef();

  // ✅ You can change these
  const studentName = "Anusree Prakash"; // get from auth later
  const courseTitle = `Course ID: ${courseId}`;
  const certificateId = `EDU-${courseId}-2026`;
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ✅ Download as PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`certificate-${courseId}.pdf`);
  };

  return (
    <div style={styles.page}>
      {/* ✅ Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>🎓 Certificate Preview</h2>
          <p style={styles.subtitle}>
            This certificate is generated in frontend (No backend PDF ✅)
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.backBtn} onClick={() => navigate(`/courses/${courseId}`)}>
            ← Back
          </button>

          <button style={styles.downloadBtn} onClick={downloadPDF}>
            ⬇ Download PDF
          </button>
        </div>
      </div>

      {/* ✅ Certificate Box */}
      <div style={styles.certWrap}>
        <div ref={certRef} style={styles.certificate}>
          {/* Border */}
          <div style={styles.borderOuter}>
            <div style={styles.borderInner}>
              {/* Logo + Top */}
              <div style={styles.topRow}>
                <div style={styles.logoBox}>🎓 EduMentor</div>
                <div style={styles.serial}>
                  Certificate ID: <b>{certificateId}</b>
                </div>
              </div>

              {/* Main Title */}
              <h1 style={styles.mainTitle}>CERTIFICATE OF COMPLETION</h1>
              <p style={styles.subText}>This is proudly presented to</p>

              {/* Student Name */}
              <h2 style={styles.student}>{studentName}</h2>

              {/* Course Text */}
              <p style={styles.courseText}>
                For successfully completing the course
              </p>

              <h3 style={styles.courseTitle}>{courseTitle}</h3>

              {/* Footer */}
              <div style={styles.footerRow}>
                <div>
                  <p style={styles.footerLabel}>Issued On</p>
                  <p style={styles.footerValue}>{date}</p>
                </div>

                <div style={styles.seal}>
                  ✅ Verified <br /> Certificate
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={styles.footerLabel}>Authorized Signature</p>
                  <div style={styles.signLine}></div>
                  <p style={styles.footerValue}>EduMentor Team</p>
                </div>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div style={styles.watermark}>EDUMENTOR</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "28px",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(79,70,229,0.14), transparent 45%), linear-gradient(180deg, #f8fafc, #eef2ff)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "900",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#64748b",
    fontWeight: "600",
    fontSize: "14px",
  },

  backBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
    background: "#eef2ff",
    color: "#4f46e5",
  },

  downloadBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
    background: "#16a34a",
    color: "white",
    boxShadow: "0 14px 28px rgba(22,163,74,0.25)",
  },

  certWrap: {
    display: "flex",
    justifyContent: "center",
  },

  certificate: {
    width: "1000px",
    height: "700px",
    position: "relative",
    background: "white",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(2,6,23,0.15)",
  },

  borderOuter: {
    position: "absolute",
    inset: "26px",
    border: "6px solid #4f46e5",
    borderRadius: "16px",
    padding: "14px",
  },

  borderInner: {
    border: "2px solid rgba(79,70,229,0.35)",
    borderRadius: "14px",
    height: "100%",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoBox: {
    fontWeight: "900",
    fontSize: "18px",
    color: "#4f46e5",
    background: "#eef2ff",
    padding: "10px 14px",
    borderRadius: "14px",
  },

  serial: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748b",
  },

  mainTitle: {
    textAlign: "center",
    fontSize: "34px",
    fontWeight: "900",
    color: "#0f172a",
    marginTop: "30px",
    marginBottom: "10px",
  },

  subText: {
    textAlign: "center",
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#64748b",
  },

  student: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "900",
    marginTop: "18px",
    marginBottom: "10px",
    color: "#4f46e5",
  },

  courseText: {
    textAlign: "center",
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#334155",
  },

  courseTitle: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "900",
    marginTop: "10px",
    color: "#0f172a",
  },

  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    marginTop: "40px",
  },

  footerLabel: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "800",
    color: "#64748b",
  },

  footerValue: {
    margin: 0,
    marginTop: "6px",
    fontSize: "14px",
    fontWeight: "900",
    color: "#0f172a",
  },

  signLine: {
    marginTop: "10px",
    width: "220px",
    height: "2px",
    background: "#0f172a",
  },

  seal: {
    width: "140px",
    height: "140px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #4f46e5, #22c55e)",
    color: "white",
    fontWeight: "900",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(79,70,229,0.25)",
  },

  watermark: {
    position: "absolute",
    fontSize: "90px",
    fontWeight: "900",
    color: "rgba(100,116,139,0.08)",
    transform: "rotate(-25deg)",
    top: "38%",
    left: "18%",
    letterSpacing: "10px",
    pointerEvents: "none",
  },
};
