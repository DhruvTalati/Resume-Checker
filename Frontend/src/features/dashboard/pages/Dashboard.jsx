import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import api from "../../../api/axios";
import { useState, useEffect, useRef } from "react";
import { useInterview } from "../../interview/hooks/useinterview";
import { useNavigate } from "react-router";
import "../styles/dashboard.scss";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { reports, getReports, loading } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    getReports();
  }, [getReports]);

  // ── Derived stats ─────────────────────────────────────────
  const avgScore =
    reports?.length > 0
      ? Math.round(
          reports.reduce((s, r) => s + (r.matchScore || 0), 0) / reports.length,
        )
      : 0;

  const totalSkillGaps =
    reports?.reduce((s, r) => s + (r.skillGaps?.length || 0), 0) || 0;

  // Collect unique skill gaps across all reports for the cloud
  const allSkillGaps = [
    ...new Set(reports?.flatMap((r) => r.skillGaps || []) || []),
  ].slice(0, 16);

  const scoreClass = (s) => (s >= 80 ? "high" : s >= 60 ? "mid" : "low");

  // Chart data
  const chartData =
    reports?.slice(0, 8).map((r, i) => ({
      name: (r.title || `Report ${i + 1}`).slice(0, 14),
      score: r.matchScore || 0,
    })) || [];

  // Trend data (last 6 reports reversed so oldest first)
  const trendData = [...(reports || [])]
    .reverse()
    .slice(0, 6)
    .map((r, i) => ({
      name: `R${i + 1}`,
      score: r.matchScore || 0,
    }));

  // Readiness ring
  const RADIUS = 48;
  const CIRC = 2 * Math.PI * RADIUS;
  const offset = CIRC - (avgScore / 100) * CIRC;

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { label: "Dashboard", icon: "📊", path: "/dashboard", active: true },
    { label: "Generate Report", icon: "✨", path: "/" },
    { label: "Reports", icon: "📄", path: "/reports" },
    { label: "ATS Resume", icon: "📑", path: "/ats-resume" },
    { label: "Profile", icon: "👤", path: "/profile" },
  ];

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-loading__spinner" />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="db-layout">
      {/* Background FX */}
      <div className="db-gradient db-gradient--1" />
      <div className="db-gradient db-gradient--2" />
      <div className="db-grid" />

      {/* Hamburger */}
      <button
        className="db-hamburger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Overlay */}
      <div
        className={`db-overlay ${!sidebarOpen ? "db-overlay--hidden" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`db-sidebar ${sidebarOpen ? "db-sidebar--open" : ""}`}>
        <div className="db-sidebar__brand">
          <div className="db-sidebar__mark">R</div>
          <span className="db-sidebar__brandname">ResumeAI</span>
        </div>

        <nav className="db-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`db-nav-item ${item.active ? "db-nav-item--active" : ""}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <span className="db-nav-item__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
            <button
              className="db-nav-item db-nav-item--danger"
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
            >
              <span className="db-nav-item__icon">🚪</span>
              Logout
            </button>
          </div>
        </nav>

        <div className="db-sidebar__footer">
          <div className="db-sidebar__user">
            <div className="db-sidebar__avatar">DT</div>
            <div>
              <div className="db-sidebar__username">Dhruv Talati</div>
              <div className="db-sidebar__role">Resume Analyzer User</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="db-main">
        <div className="db-content">
          {/* ── Top Bar ── */}
          <div className="db-topbar">
            <div className="db-topbar__left">
              <h1 className="db-topbar__greeting">Welcome back 👋</h1>
              <p className="db-topbar__sub">
                Track your interview readiness and resume performance.
              </p>
            </div>
            <div className="db-topbar__actions">
              <div className="db-search">
                <span className="db-search__icon">🔍</span>
                Search reports
              </div>
              <button className="db-notif-btn" aria-label="Notifications">
                🔔
                <span className="db-notif-btn__dot" />
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="db-stats">
            <div className="db-stat">
              <div className="db-stat__icon db-stat__icon--teal">📄</div>
              <div className="db-stat__label">Total Reports</div>
              <div className="db-stat__value">{reports?.length || 0}</div>
              <div className="db-stat__delta db-stat__delta--neutral">
                All time
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat__icon db-stat__icon--blue">🎯</div>
              <div className="db-stat__label">Avg Match Score</div>
              <div className="db-stat__value">{avgScore}%</div>
              <div
                className={`db-stat__delta db-stat__delta--${avgScore >= 70 ? "up" : avgScore >= 50 ? "neutral" : "down"}`}
              >
                {avgScore >= 70
                  ? "↑ Strong"
                  : avgScore >= 50
                    ? "→ Fair"
                    : "↓ Needs work"}
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat__icon db-stat__icon--amber">📑</div>
              <div className="db-stat__label">Resumes Analyzed</div>
              <div className="db-stat__value">{reports?.length || 0}</div>
              <div className="db-stat__delta db-stat__delta--neutral">
                Sessions
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat__icon db-stat__icon--red">⚠️</div>
              <div className="db-stat__label">Skill Gaps Found</div>
              <div className="db-stat__value">{totalSkillGaps}</div>
              <div
                className={`db-stat__delta db-stat__delta--${totalSkillGaps === 0 ? "up" : "down"}`}
              >
                {totalSkillGaps === 0 ? "None — great!" : "Needs attention"}
              </div>
            </div>
          </div>

          {/* ── Chart Row ── */}
          <div className="db-grid-2">
            {/* Bar Chart */}
            <div className="db-card">
              <div className="db-card__head">
                <span className="db-card__title">
                  <span className="db-card__icon">📊</span>
                  Match Score Analytics
                </span>
                <button
                  className="db-card__action"
                  onClick={() => navigate("/reports")}
                >
                  View all →
                </button>
              </div>
              <div className="db-card__body">
                <div className="db-chart-wrap">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="barGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#00c6a2" />
                            <stop offset="100%" stopColor="#00b4d8" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="rgba(255,255,255,0.05)"
                          strokeDasharray="4 4"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#475569"
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#475569"
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(10,18,35,0.95)",
                            border: "1px solid rgba(0,198,162,0.2)",
                            borderRadius: "12px",
                            color: "#f8fafc",
                            fontSize: "0.82rem",
                          }}
                          cursor={{ fill: "rgba(0,198,162,0.05)" }}
                        />
                        <Bar
                          dataKey="score"
                          fill="url(#barGrad)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                        fontSize: "0.85rem",
                      }}
                    >
                      No reports yet — generate your first one!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Readiness + Quick Actions */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Readiness Card */}
              <div className="db-card">
                <div className="db-card__head">
                  <span className="db-card__title">
                    <span className="db-card__icon">🎯</span>
                    Interview Readiness
                  </span>
                </div>
                <div className="db-readiness">
                  <div className="db-readiness__ring">
                    <svg
                      className="db-readiness__svg"
                      width="120"
                      height="120"
                      viewBox="0 0 120 120"
                    >
                      <defs>
                        <linearGradient
                          id="readGrad"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#00c6a2" />
                          <stop offset="100%" stopColor="#00b4d8" />
                        </linearGradient>
                      </defs>
                      <circle
                        className="db-readiness__track"
                        cx="60"
                        cy="60"
                        r={RADIUS}
                      />
                      <circle
                        className="db-readiness__fill"
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        strokeDasharray={CIRC}
                        strokeDashoffset={reports?.length ? offset : CIRC}
                      />
                    </svg>
                    <div className="db-readiness__label">
                      <span className="db-readiness__pct">
                        {reports?.length ? avgScore : "—"}
                        {reports?.length ? "%" : ""}
                      </span>
                      <span className="db-readiness__sublabel">Ready</span>
                    </div>
                  </div>
                  <p className="db-readiness__caption">
                    {avgScore >= 80
                      ? "You're well-prepared! Keep refining."
                      : avgScore >= 60
                        ? "Good progress. Address skill gaps to improve."
                        : reports?.length
                          ? "Focus on identified skill gaps to boost your score."
                          : "Generate a report to see your readiness score."}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="db-card">
                <div className="db-card__head">
                  <span className="db-card__title">
                    <span className="db-card__icon">⚡</span>
                    Quick Actions
                  </span>
                </div>
                <div className="db-quick">
                  <button
                    className="db-quick-btn db-quick-btn--primary"
                    onClick={() => navigate("/")}
                  >
                    <span>✨</span> Generate New Strategy
                  </button>
                  <button
                    className="db-quick-btn"
                    onClick={() => navigate("/reports")}
                  >
                    <span className="db-quick-btn__icon">📄</span> View Reports
                  </button>
                  <button
                    className="db-quick-btn"
                    onClick={() => navigate("/ats-resume")}
                  >
                    <span className="db-quick-btn__icon">📑</span> ATS Resume
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Row ── */}
          <div className="db-grid-2">
            {/* Recent Reports */}
            <div className="db-card">
              <div className="db-card__head">
                <span className="db-card__title">
                  <span className="db-card__icon">🕒</span>
                  Recent Reports
                </span>
                <button
                  className="db-card__action"
                  onClick={() => navigate("/reports")}
                >
                  See all →
                </button>
              </div>
              <div className="db-card__body">
                {reports?.length > 0 ? (
                  <div className="db-report-list">
                    {reports.slice(0, 5).map((r) => {
                      const sc = scoreClass(r.matchScore);
                      return (
                        <div
                          key={r._id}
                          className="db-report-item"
                          onClick={() => navigate(`/interview/${r._id}`)}
                        >
                          <div
                            className={`db-report-item__bar db-report-item__bar--${sc}`}
                          />
                          <div className="db-report-item__info">
                            <div className="db-report-item__title">
                              {r.title || "Untitled Position"}
                            </div>
                            <div className="db-report-item__date">
                              {new Date(r.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </div>
                          <span
                            className={`db-report-item__score db-report-item__score--${sc}`}
                          >
                            {r.matchScore}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "0.85rem",
                      textAlign: "center",
                      padding: "2rem 0",
                    }}
                  >
                    No reports yet. Generate your first interview strategy!
                  </p>
                )}
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="db-card">
              <div className="db-card__head">
                <span className="db-card__title">
                  <span className="db-card__icon">🔍</span>
                  Top Skill Gaps
                </span>
              </div>
              {allSkillGaps.length > 0 ? (
                <div className="db-skill-cloud">
                  {allSkillGaps.map((skill) => (
                    <span key={skill} className="db-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="db-card__body">
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "0.85rem",
                      textAlign: "center",
                      padding: "1.5rem 0",
                    }}
                  >
                    {reports?.length
                      ? "No skill gaps found — great shape!"
                      : "Generate reports to see skill gaps."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
