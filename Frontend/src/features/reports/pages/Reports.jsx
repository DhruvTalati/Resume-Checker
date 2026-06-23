import { useEffect, useState } from "react";
import { useInterview } from "../../interview/hooks/useinterview";
import "../style/reports.scss";
import { useNavigate } from "react-router";
import api from "../../../api/axios";

const Reports = () => {
  const navigate = useNavigate();
  const { reports, getReports, loading } = useInterview();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getReports();
  }, []);

  const totalReports = reports?.length || 0;

  const avgScore =
    totalReports > 0
      ? Math.round(
          reports.reduce((sum, report) => sum + (report.matchScore || 0), 0) /
            totalReports,
        )
      : 0;

  const bestScore =
    totalReports > 0
      ? Math.max(...reports.map((report) => report.matchScore || 0))
      : 0;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/interview/${id}`);

      getReports();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredReports = reports?.filter((report) =>
    report.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="reports-page">
      <h1>📄 Interview Reports</h1>
      <div className="reports-toolbar">
        <input
          type="text"
          placeholder="🔍 Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {loading && <p>Loading...</p>}
      {!loading && reports?.length === 0 && (
        <div className="empty-state">
          <h3>No Reports Yet</h3>
          <p>Generate your first interview report to see analytics here.</p>
        </div>
      )}

      <div className="reports-stats">
        <div className="stat-box">
          <h3>{totalReports}</h3>
          <p>Total Reports</p>
        </div>

        <div className="stat-box">
          <h3>{avgScore}%</h3>
          <p>Average Score</p>
        </div>

        <div className="stat-box">
          <h3>{bestScore}%</h3>
          <p>Best Score</p>
        </div>
      </div>

      <div className="stat-box">
        <h3>
          {reports?.length > 0
            ? new Date(
                reports[reports.length - 1]?.createdAt,
              ).toLocaleDateString()
            : "--"}
        </h3>
        <p>Last Report</p>
      </div>

      <div className="reports-grid">
        {filteredReports?.map((report) => (
          <div key={report._id} className="report-card">
            <div className="report-header">
              <div>
                <h3>{report.title}</h3>
                <p className="report-date">
                  📅 {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div
                className={`score-badge ${
                  report.matchScore >= 80
                    ? "high-score"
                    : report.matchScore >= 60
                      ? "medium-score"
                      : "low-score"
                }`}
              >
                {report.matchScore}%
              </div>
            </div>

            <p className="report-status">
              {report.matchScore >= 80
                ? "🔥 Strong Match"
                : report.matchScore >= 60
                  ? "👍 Good Match"
                  : "⚠ Needs Improvement"}
            </p>
            <h3>{report.title || "Interview Report"}</h3>

            <div className="score-badge">{report.matchScore}%</div>

            <div className="action-buttons">
              <button
                className="view-btn"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                View Report
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(report._id)}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this report?",
                    )
                  ) {
                    handleDelete(report._id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
