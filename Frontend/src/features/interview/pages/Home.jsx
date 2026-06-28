import { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useinterview.js";
import { useNavigate } from "react-router";

const MAX_JD = 5000;
const MAX_MB = 5;
const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  // ── File validation ──────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setErrors((p) => ({
        ...p,
        file: "Only PDF or DOCX files are accepted.",
      }));
      e.target.value = "";
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErrors((p) => ({ ...p, file: `File exceeds ${MAX_MB}MB limit.` }));
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setErrors((p) => ({ ...p, file: "", profile: "" }));
  };

  // ── Form validation ──────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!jobDescription.trim())
      e.jobDescription = "Job description is required.";
    else if (jobDescription.trim().length < 50)
      e.jobDescription =
        "Too short — paste the full job description for better results.";
    if (!selectedFile && !selfDescription.trim())
      e.profile = "Upload a resume or write a self description.";
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleGenerateReport = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setGenerating(true);
    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: selectedFile,
      });

      if (!data || !data._id) {
        setErrors({ form: "Report generation failed. Please try again." });
        return;
      }

      navigate(`/interview/${data._id}`);
    } catch (error) {
      console.error(error);
      const status = error?.response?.status;
      if (status === 429)
        setErrors({
          form: "AI quota exceeded. Please wait a few minutes and try again.",
        });
      else if (status === 503)
        setErrors({ form: "AI is busy right now. Please try again shortly." });
      else setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setGenerating(false);
    }
  };

  // ── Score badge helper ───────────────────────────────────────────────────
  const scoreClass = (s) =>
    s >= 80 ? "score--high" : s >= 60 ? "score--mid" : "score--low";

  const jdLen = jobDescription.length;

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-loading__spinner"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ── Background FX (same as login) ── */}
      <div className="home-gradient home-gradient--1"></div>
      <div className="home-gradient home-gradient--2"></div>
      <div className="home-grid"></div>

      <div className="home-inner">
        {/* ── Top Nav ── */}
        <nav className="home-nav">
          <div className="home-nav__brand">
            <div className="home-nav__mark">R</div>
            <span>ResumeAI</span>
          </div>
          <div className="home-nav__actions">
            <button className="nav-pill" onClick={() => navigate("/dashboard")}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </button>
            <button className="nav-pill" onClick={() => navigate("/reports")}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Reports
            </button>
          </div>
        </nav>

        {/* ── Hero Header ── */}
        <header className="home-hero">
          <div className="home-hero__badge">AI-Powered Career Platform</div>
          <h1>
            Build Your <span>Interview Strategy</span>
          </h1>
          <p>
            Paste a job description, upload your resume — our AI generates
            personalized questions, skill gaps, and a day-by-day prep plan in
            seconds.
          </p>

          {/* ── Step Pills ── */}
          <div className="home-steps">
            <div className="step-pill">
              <span className="step-pill__num">1</span>
              Paste job description
            </div>
            <div className="step-pill__arrow">→</div>
            <div className="step-pill">
              <span className="step-pill__num">2</span>
              Upload resume
            </div>
            <div className="step-pill__arrow">→</div>
            <div className="step-pill">
              <span className="step-pill__num">3</span>
              Get your strategy
            </div>
          </div>
        </header>

        {/* ── Main Generator Card ── */}
        <div className="gen-card">
          {/* ── Global form error ── */}
          {errors.form && (
            <div className="form-error-banner">
              <span>⚠</span> {errors.form}
            </div>
          )}

          <div className="gen-card__body">
            {/* ── Left: Job Description ── */}
            <div className="gen-panel">
              <div className="gen-panel__header">
                <div className="gen-panel__icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h2>Job Description</h2>
                <span className="badge badge--required">Required</span>
              </div>

              <textarea
                className={`gen-panel__textarea${errors.jobDescription ? " textarea--error" : ""}`}
                placeholder={`Paste the full job description here…\n\ne.g. "Senior Frontend Engineer at Google — requires React, TypeScript, system design experience…"`}
                value={jobDescription}
                maxLength={MAX_JD}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setErrors((p) => ({ ...p, jobDescription: "" }));
                }}
              />

              <div className="gen-panel__footer">
                {errors.jobDescription ? (
                  <span className="field-error">⚠ {errors.jobDescription}</span>
                ) : (
                  <span />
                )}
                <span
                  className="char-counter"
                  style={{
                    color: jdLen > MAX_JD * 0.9 ? "#f59e0b" : undefined,
                  }}
                >
                  {jdLen.toLocaleString()} / {MAX_JD.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="gen-divider" />

            {/* ── Right: Profile ── */}
            <div className="gen-panel">
              <div className="gen-panel__header">
                <div className="gen-panel__icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2>Your Profile</h2>
              </div>

              {/* Upload Zone */}
              <div className="upload-zone-wrap">
                <div className="upload-zone-label">
                  Upload Resume
                  <span className="badge badge--best">Best Results</span>
                </div>
                <label
                  className={`upload-zone${selectedFile ? " upload-zone--selected" : ""}${errors.file ? " upload-zone--error" : ""}`}
                  htmlFor="resume-file"
                >
                  <span className="upload-zone__icon" aria-hidden="true">
                    {selectedFile ? (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                    )}
                  </span>
                  {selectedFile ? (
                    <>
                      <p className="upload-zone__name">{selectedFile.name}</p>
                      <p className="upload-zone__sub">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <p className="upload-zone__title">
                        Click to upload or drag & drop
                      </p>
                      <p className="upload-zone__sub">
                        PDF or DOCX · Max {MAX_MB}MB
                      </p>
                    </>
                  )}
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume-file"
                    name="resume"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                </label>
                {errors.file && (
                  <span className="field-error">⚠ {errors.file}</span>
                )}
              </div>

              {/* OR */}
              <div className="or-divider">
                <span>OR</span>
              </div>

              {/* Self Description */}
              <div className="self-desc-wrap">
                <label className="upload-zone-label" htmlFor="selfDescription">
                  Quick Self-Description
                </label>
                <textarea
                  id="selfDescription"
                  className={`gen-panel__textarea gen-panel__textarea--short${errors.profile && !selectedFile ? " textarea--error" : ""}`}
                  placeholder="Describe your experience, key skills, and years of experience if you don't have a resume handy…"
                  value={selfDescription}
                  onChange={(e) => {
                    setSelfDescription(e.target.value);
                    setErrors((p) => ({ ...p, profile: "" }));
                  }}
                />
                {errors.profile && (
                  <span className="field-error">⚠ {errors.profile}</span>
                )}
              </div>

              {/* Info Box */}
              <div className="info-box">
                <svg
                  className="info-box__icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="#07111f"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="#07111f"
                    strokeWidth="2"
                  />
                </svg>
                <p>
                  A <strong>resume</strong> or <strong>self description</strong>{" "}
                  is required. Both give the best results.
                </p>
              </div>
            </div>
          </div>

          {/* ── Card Footer ── */}
          <div className="gen-card__footer">
            <span className="gen-card__hint">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              AI-powered · approx. 30 seconds
            </span>
            <div className="gen-card__actions">
              <button
                className="btn-secondary"
                onClick={() => navigate("/dashboard")}
                disabled={generating}
              >
                📊 Dashboard
              </button>
              <button
                className="btn-primary"
                onClick={handleGenerateReport}
                disabled={generating || loading}
              >
                {generating ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true"></span>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    Generate Interview Strategy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Feature Strip ── */}
        <div className="feature-strip">
          <div className="feature-strip__item">
            <span className="feature-strip__icon">🎯</span>
            <span>Role-specific questions</span>
          </div>
          <div className="feature-strip__sep" aria-hidden="true">
            ·
          </div>
          <div className="feature-strip__item">
            <span className="feature-strip__icon">📊</span>
            <span>Match score analysis</span>
          </div>
          <div className="feature-strip__sep" aria-hidden="true">
            ·
          </div>
          <div className="feature-strip__item">
            <span className="feature-strip__icon">🔍</span>
            <span>Skill gap detection</span>
          </div>
          <div className="feature-strip__sep" aria-hidden="true">
            ·
          </div>
          <div className="feature-strip__item">
            <span className="feature-strip__icon">🗓</span>
            <span>Day-by-day prep plan</span>
          </div>
        </div>

        {/* ── Recent Reports ── */}
        {reports?.length > 0 && (
          <section className="recent-section">
            <div className="recent-section__header">
              <h2>Recent Interview Plans</h2>
              <button
                className="see-all-btn"
                onClick={() => navigate("/reports")}
              >
                See all →
              </button>
            </div>
            <ul className="recent-grid">
              {reports.slice(0, 6).map((r) => (
                <li
                  key={r._id}
                  className="recent-card"
                  onClick={() => navigate(`/interview/${r._id}`)}
                >
                  <div className="recent-card__top">
                    <h3>{r.title || "Untitled Position"}</h3>
                    <span className={`score-badge ${scoreClass(r.matchScore)}`}>
                      {r.matchScore}%
                    </span>
                  </div>
                  <p className="recent-card__date">
                    {new Date(r.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="recent-card__bar">
                    <div
                      className={`recent-card__fill ${scoreClass(r.matchScore)}`}
                      style={{ width: `${r.matchScore}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="home-footer">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </footer>
      </div>
    </div>
  );
};

export default Home;
