import "../auth.form.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FileText,
  ScanSearch,
  BriefcaseBusiness,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="auth-page">
        <div className="loader-container">
          <div className="loader"></div>
          <p>Creating your AI workspace...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="gradient gradient-1"></div>
      <div className="gradient gradient-2"></div>
      <div className="grid-overlay"></div>

      <div className="auth-wrapper">
        {/* ── LEFT: Hero ── */}
        <section className="hero-section">
          <div className="hero-badge">AI Powered Career Platform</div>

          <h1>
            ResumeAI
            <span>Start Your Career Journey</span>
          </h1>

          <p className="hero-desc">
            Create your account to unlock AI-powered resume analysis, ATS
            optimization, personalized interview preparation, and
            recruiter-ready resume generation.
          </p>

          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={18} />
              </div>
              <div>
                <h3>Resume Analysis</h3>
                <p>Receive detailed AI feedback to strengthen your resume.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ScanSearch size={18} />
              </div>
              <div>
                <h3>ATS Optimization</h3>
                <p>
                  Improve ATS compatibility and increase recruiter visibility.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BriefcaseBusiness size={18} />
              </div>
              <div>
                <h3>Interview Prep</h3>
                <p>
                  Practice personalized technical and HR interview questions.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={18} />
              </div>
              <div>
                <h3>AI Resume Builder</h3>
                <p>Generate recruiter-ready resumes in just a few clicks.</p>
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <h2>95%</h2>
              <span>ATS Accuracy</span>
            </div>
            <div className="stat">
              <h2>10K+</h2>
              <span>Resumes Reviewed</span>
            </div>
            <div className="stat">
              <h2>24/7</h2>
              <span>AI Assistant</span>
            </div>
          </div>

          <div className="dashboard-preview">
            <h3>Career Readiness Score</h3>

            <div className="progress-item">
              <span>ATS Score</span>
              <strong>92%</strong>
            </div>
            <div className="progress">
              <div className="progress-fill ats"></div>
            </div>

            <div className="progress-item">
              <span>Resume Match</span>
              <strong>87%</strong>
            </div>
            <div className="progress">
              <div className="progress-fill match"></div>
            </div>

            <div className="progress-item">
              <span>Interview Ready</span>
              <strong>95%</strong>
            </div>
            <div className="progress">
              <div className="progress-fill interview"></div>
            </div>
          </div>
        </section>

        {/* ── RIGHT: Register Card ── */}
        <section className="login-section">
          <div className="login-card">
            <div className="login-header">
              <div className="mini-badge">Join ResumeAI</div>
              <h2>Create Account</h2>
              <p>Start your placement journey with AI-powered career tools.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <small className="password-hint">
                  At least 8 characters with letters, numbers and symbols.
                </small>
              </div>

              <button
                className="button primary-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-loader"></span>Creating Account...
                  </>
                ) : (
                  "Create Free Account"
                )}
              </button>
            </form>

            <div className="divider">
              <span>Secure Registration</span>
            </div>

            <div className="security-note">
              <ShieldCheck size={16} />
              <p>
                Your account and personal information are securely encrypted.
              </p>
            </div>

            <div className="login-footer">
              <p>Already have an account?</p>
              <Link to="/login">Sign In →</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
