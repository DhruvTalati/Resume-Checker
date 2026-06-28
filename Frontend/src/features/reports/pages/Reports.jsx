import { useEffect, useState } from "react";
import { useInterview } from "../../interview/hooks/useinterview";
import { useNavigate } from "react-router";
import api from "../../../api/axios";
import Sidebar from "../../Sidebar/Sidebar";
import "../style/reports.scss";

const Reports = () => {
  const navigate = useNavigate();
  const { reports, getReports, loading } = useInterview();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    getReports();
  }, [getReports]);

  const totalReports = reports?.length || 0;
  const avgScore =
    totalReports > 0
      ? Math.round(
          reports.reduce((s, r) => s + (r.matchScore || 0), 0) / totalReports,
        )
      : 0;
  const bestScore =
    totalReports > 0 ? Math.max(...reports.map((r) => r.matchScore || 0)) : 0;
  const lastReport =
    reports?.length > 0
      ? new Date(reports[reports.length - 1]?.createdAt).toLocaleDateString(
          "en-GB",
          { day: "numeric", month: "short", year: "numeric" },
        )
      : "--";

  const scoreClass = (s) => (s >= 80 ? "high" : s >= 60 ? "mid" : "low");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await api.delete(`/api/interview/${id}`);
      getReports();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = [...(reports || [])]
    .filter((r) => r.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "score-desc")
        return (b.matchScore || 0) - (a.matchScore || 0);
      if (sortBy === "score-asc")
        return (a.matchScore || 0) - (b.matchScore || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="rp-layout">
      {/* BG FX */}
      <div className="rp-gradient rp-gradient--1" />
      <div className="rp-gradient rp-gradient--2" />
      <div className="rp-grid-bg" />

      {/* Hamburger */}
      <button
        className="rp-ham"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="rp-main">
        <div className="rp-content">
          {/* Header */}
          <div className="rp-header">
            <div>
              <div className="rp-header__badge">All Reports</div>
              <h1 className="rp-header__title">Interview Reports</h1>
              <p className="rp-header__sub">
                Track your progress across all interview strategies.
              </p>
            </div>
            <button className="rp-new-btn" onClick={() => navigate("/")}>
              ✨ New Strategy
            </button>
          </div>

          {/* Stats */}
          <div className="rp-stats">
            {[
              { icon: "📄", label: "Total Reports", value: totalReports },
              { icon: "🎯", label: "Average Score", value: `${avgScore}%` },
              { icon: "🏆", label: "Best Score", value: `${bestScore}%` },
              { icon: "🕒", label: "Last Report", value: lastReport },
            ].map((s) => (
              <div key={s.label} className="rp-stat">
                <span className="rp-stat__icon">{s.icon}</span>
                <span className="rp-stat__value">{s.value}</span>
                <span className="rp-stat__label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="rp-toolbar">
            <div className="rp-search">
              <span className="rp-search__icon">🔍</span>
              <input
                type="text"
                placeholder="Search reports…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rp-search__input"
              />
              {searchTerm && (
                <button
                  className="rp-search__clear"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </button>
              )}
            </div>
            <select
              className="rp-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Newest first</option>
              <option value="score-desc">Highest score</option>
              <option value="score-asc">Lowest score</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rp-loading">
              <div className="rp-loading__spinner" />
              <p>Loading reports…</p>
            </div>
          )}

          {/* Empty */}
          {!loading && totalReports === 0 && (
            <div className="rp-empty">
              <div className="rp-empty__icon">📭</div>
              <h3>No reports yet</h3>
              <p>Generate your first interview strategy to see results here.</p>
              <button className="rp-new-btn" onClick={() => navigate("/")}>
                ✨ Generate Now
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="rp-grid">
              {filtered.map((r) => {
                const sc = scoreClass(r.matchScore);
                return (
                  <div key={r._id} className="rp-card">
                    <div className="rp-card__top">
                      <div className={`rp-card__bar rp-card__bar--${sc}`} />
                      <div className="rp-card__info">
                        <h3 className="rp-card__title">
                          {r.title || "Untitled Position"}
                        </h3>
                        <p className="rp-card__date">
                          📅{" "}
                          {new Date(r.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`rp-score rp-score--${sc}`}>
                        {r.matchScore}%
                      </span>
                    </div>

                    <div className="rp-card__status">
                      {r.matchScore >= 80
                        ? "🔥 Strong Match"
                        : r.matchScore >= 60
                          ? "👍 Good Match"
                          : "⚠ Needs Work"}
                    </div>

                    <div className="rp-card__prog">
                      <div
                        className={`rp-card__fill rp-card__fill--${sc}`}
                        style={{ width: `${r.matchScore}%` }}
                      />
                    </div>

                    {r.skillGaps?.length > 0 && (
                      <div className="rp-card__gaps">
                        {r.skillGaps.slice(0, 3).map((g) => (
                          <span key={g} className="rp-gap-tag">
                            {g}
                          </span>
                        ))}
                        {r.skillGaps.length > 3 && (
                          <span className="rp-gap-tag rp-gap-tag--more">
                            +{r.skillGaps.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="rp-card__actions">
                      <button
                        className="rp-btn rp-btn--view"
                        onClick={() => navigate(`/interview/${r._id}`)}
                      >
                        View Report
                      </button>
                      <button
                        className="rp-btn rp-btn--delete"
                        onClick={() => handleDelete(r._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results from search */}
          {!loading && totalReports > 0 && filtered.length === 0 && (
            <div className="rp-empty">
              <div className="rp-empty__icon">🔍</div>
              <h3>No results found</h3>
              <p>Try a different search term.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;
