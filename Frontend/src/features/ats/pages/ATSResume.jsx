import { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../../Sidebar/Sidebar";
import "../style/ATSResume.scss";

const ATSResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setScore(null);
    setTimeout(() => {
      setScore(87);
      setLoading(false);
    }, 3000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const scoreClass = (s) => (s >= 80 ? "excellent" : s >= 60 ? "good" : "poor");
  const scoreLabel = (s) =>
    s >= 80
      ? "🔥 Excellent ATS Compatibility"
      : s >= 60
        ? "👍 Good ATS Compatibility"
        : "⚠ Needs Optimization";
  const scoreDesc = (s) =>
    s >= 80
      ? "Your resume is highly optimized for Applicant Tracking Systems."
      : s >= 60
        ? "Your resume performs well but can be improved further."
        : "Your resume may struggle to pass ATS screening. Apply the suggestions below.";

  return (
    <div className="ats-layout">
      <div className="ats-gradient ats-gradient--1" />
      <div className="ats-gradient ats-gradient--2" />
      <div className="ats-grid-bg" />

      <button
        className="ats-ham"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="ats-main">
        <div className="ats-content">
          {/* Header */}
          <div className="ats-header">
            <div className="ats-header__badge">ATS Checker</div>
            <h1 className="ats-header__title">Resume ATS Analyzer</h1>
            <p className="ats-header__sub">
              Upload your resume and find out how well it passes Applicant
              Tracking Systems.
            </p>
          </div>

          {/* Upload Card */}
          <div className="ats-card">
            <div
              className={`ats-upload ${dragOver ? "ats-upload--drag" : ""} ${file ? "ats-upload--selected" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <label className="ats-upload__label" htmlFor="ats-file">
                <div className="ats-upload__icon">{file ? "✅" : "📄"}</div>
                {file ? (
                  <>
                    <p className="ats-upload__filename">{file.name}</p>
                    <p className="ats-upload__sub">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="ats-upload__title">
                      Click to upload or drag & drop
                    </p>
                    <p className="ats-upload__sub">PDF only · Max 5MB</p>
                  </>
                )}
                <input
                  hidden
                  id="ats-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <button
              className="ats-analyze-btn"
              onClick={handleAnalyze}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <span className="ats-btn-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <span>🔍</span> Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="ats-scanning">
              <div className="ats-scanning__bar">
                <div className="ats-scanning__fill" />
              </div>
              <p>Scanning your resume against ATS patterns…</p>
            </div>
          )}

          {/* Results */}
          {score !== null && !loading && (
            <div className="ats-results">
              {/* Score Hero */}
              <div className="ats-score-hero">
                <div className={`ats-ring ats-ring--${scoreClass(score)}`}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop
                          offset="0%"
                          stopColor={
                            score >= 80
                              ? "#00c6a2"
                              : score >= 60
                                ? "#f59e0b"
                                : "#ef4444"
                          }
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            score >= 80
                              ? "#00b4d8"
                              : score >= 60
                                ? "#fbbf24"
                                : "#f87171"
                          }
                        />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="80"
                      cy="80"
                      r="66"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="66"
                      fill="none"
                      stroke="url(#atsGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 66}
                      strokeDashoffset={2 * Math.PI * 66 * (1 - score / 100)}
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                  <div className="ats-ring__inner">
                    <span className="ats-ring__pct">{score}%</span>
                    <span className="ats-ring__sub">ATS Score</span>
                  </div>
                </div>

                <div className="ats-score-hero__info">
                  <h2 className="ats-score-hero__label">{scoreLabel(score)}</h2>
                  <p className="ats-score-hero__desc">{scoreDesc(score)}</p>
                  <div className="ats-mini-stats">
                    {[
                      { label: "Keywords Found", value: "24", icon: "✅" },
                      { label: "Missing Keywords", value: "3", icon: "⚠" },
                      { label: "Resume Length", value: "1 Page", icon: "📄" },
                      { label: "Format Score", value: "Good", icon: "🎨" },
                    ].map((s) => (
                      <div key={s.label} className="ats-mini-stat">
                        <span className="ats-mini-stat__icon">{s.icon}</span>
                        <span className="ats-mini-stat__value">{s.value}</span>
                        <span className="ats-mini-stat__label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="ats-detail-grid">
                {/* Missing keywords */}
                <div className="ats-detail-card">
                  <h3 className="ats-detail-card__title">⚠ Missing Keywords</h3>
                  <div className="ats-kw-list">
                    {["Docker", "CI/CD", "Redux Toolkit"].map((k) => (
                      <span key={k} className="ats-kw-tag">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="ats-detail-card">
                  <h3 className="ats-detail-card__title">
                    💡 Improvement Tips
                  </h3>
                  <ul className="ats-tip-list">
                    {[
                      "Add Docker experience or projects.",
                      "Mention CI/CD pipeline knowledge.",
                      "Include Redux Toolkit in relevant projects.",
                      "Add more measurable achievements.",
                      "Use ATS-friendly section headings.",
                    ].map((tip) => (
                      <li key={tip} className="ats-tip">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="ats-result-actions">
                <button
                  className="ats-action-btn ats-action-btn--primary"
                  onClick={() => {}}
                >
                  📥 Download Report
                </button>
                <button
                  className="ats-action-btn ats-action-btn--sec"
                  onClick={() => {
                    setScore(null);
                    setFile(null);
                  }}
                >
                  🔄 Analyze Again
                </button>
                <button
                  className="ats-action-btn ats-action-btn--sec"
                  onClick={() => navigate("/")}
                >
                  ✨ Generate Strategy
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ATSResume;
