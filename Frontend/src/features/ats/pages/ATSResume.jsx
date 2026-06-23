import "../style/ATSResume.scss";
import { useState } from "react";

const ATSResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setScore(87);
      setLoading(false);
    }, 3000);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="ats-page">
      <div className="ats-header">
        <h1>📑 ATS Resume Checker</h1>
        <p>
          Upload your resume and check how well it performs against ATS systems.
        </p>
      </div>

      <div className="ats-card">
        <label className="upload-box">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="upload-content">
            <h3>📄 Upload Resume</h3>
            <p>{file ? file.name : "Drag & Drop or Click to Upload"}</p>
          </div>
        </label>

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "📊 Checking ATS Score..." : "Analyze Resume"}
        </button>
      </div>
      {score && (
        <div className="result-card">
          <h2>📊 ATS Analysis Result</h2>

          {/* Score Circle */}
          <div
            className={`score-circle ${
              score >= 80 ? "excellent" : score >= 60 ? "good" : "poor"
            }`}
          >
            {score}%
          </div>

          {/* ATS Stats */}
          <div className="ats-stats">
            <div className="ats-stat">
              <h4>Keywords Found</h4>
              <span>24</span>
            </div>

            <div className="ats-stat">
              <h4>Missing Keywords</h4>
              <span>3</span>
            </div>

            <div className="ats-stat">
              <h4>Resume Length</h4>
              <span>1 Page</span>
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="keywords">
            <h3>⚠️ Missing Keywords</h3>

            <div className="keyword-list">
              <span>Docker</span>
              <span>CI/CD</span>
              <span>Redux Toolkit</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="suggestions">
            <h3>💡 Improvement Suggestions</h3>

            <ul>
              <li>Add Docker experience or projects.</li>
              <li>Mention CI/CD pipeline knowledge.</li>
              <li>Include Redux Toolkit in relevant projects.</li>
              <li>Add more measurable achievements.</li>
              <li>Use ATS-friendly section headings.</li>
            </ul>
          </div>

          {/* Resume Status */}
          <div className="resume-status">
            <strong>
              {score >= 80
                ? "🔥 Excellent ATS Compatibility"
                : score >= 60
                  ? "👍 Good ATS Compatibility"
                  : "⚠️ Needs Optimization"}
            </strong>

            <p>
              {score >= 80
                ? "Your resume is highly optimized for Applicant Tracking Systems."
                : score >= 60
                  ? "Your resume performs well but can be improved further."
                  : "Your resume may struggle to pass ATS screening. Consider applying the suggestions above."}
            </p>
          </div>

          {/* Actions */}
          <div className="result-actions">
            <button className="download-report-btn">📥 Download Report</button>

            <button className="reanalyze-btn">🔄 Analyze Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSResume;
