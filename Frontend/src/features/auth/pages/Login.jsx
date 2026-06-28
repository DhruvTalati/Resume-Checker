import "../auth.form.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import {
  FileText,
  ScanSearch,
  Rocket,
  ShieldCheck,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoLogin = async () => {
    const demoEmail = "demo@resumeanalyzer.com";
    const demoPassword = "Demo@123";
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      await handleLogin({ email: demoEmail, password: demoPassword });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
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
          <p>Preparing your AI workspace...</p>
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
            <span>Your AI Career Assistant</span>
          </h1>

          <p className="hero-desc">
            Build ATS-friendly resumes, practice personalized interviews,
            improve your resume score and accelerate your placement journey
            using AI.
          </p>

          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={18} />
              </div>
              <div>
                <h3>Resume Analysis</h3>
                <p>Get detailed AI insights on your resume.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ScanSearch size={18} />
              </div>
              <div>
                <h3>ATS Optimization</h3>
                <p>Improve your chances of getting shortlisted.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BriefcaseBusiness size={18} />
              </div>
              <div>
                <h3>Interview Prep</h3>
                <p>Practice personalized interview questions.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={18} />
              </div>
              <div>
                <h3>AI Resume Builder</h3>
                <p>Generate recruiter-friendly resumes instantly.</p>
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
        </section>

        {/* ── RIGHT: Login Card ── */}
        <section className="login-section">
          <div className="login-card">
            <div className="login-header">
              <div className="mini-badge">Welcome Back</div>
              <h2>Sign In</h2>
              <p>Continue your placement preparation.</p>
            </div>

            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="button primary-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-loader"></span>Signing In...
                  </>
                ) : (
                  "Continue to Dashboard"
                )}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="demo-card">
              <div className="demo-header">
                <div className="demo-icon">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3>Explore the Platform</h3>
                  <p>Try every feature without an account.</p>
                </div>
              </div>

              <div className="credential-box">
                <div className="credential">
                  <span>Email</span>
                  <strong>demo@resumeanalyzer.com</strong>
                </div>
                <div className="credential">
                  <span>Password</span>
                  <strong>Demo@123</strong>
                </div>
              </div>

              <button className="button demo-button" onClick={handleDemoLogin}>
                Launch Demo →
              </button>
            </div>

            <div className="security-note">
              <ShieldCheck size={16} />
              <p>Your data is encrypted and securely stored.</p>
            </div>

            <div className="login-footer">
              <p>New here?</p>
              <Link to="/register">Create Free Account</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
