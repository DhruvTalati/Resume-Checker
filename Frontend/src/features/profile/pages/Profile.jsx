import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "../style/profile.scss";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const reportsCount = reports.length;

  const avgScore =
    reports.length > 0
      ? Math.round(
          reports.reduce((sum, report) => sum + report.matchScore, 0) /
            reports.length,
        )
      : 0;

  const resumeCount = 0;

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/api/auth/get-me");
        setUser(response.data.user);
        try {
          const reportsResponse = await api.get("/api/interview");
          setReports(reportsResponse.data.reports || []);
        } catch (error) {
          console.log("Reports Error:", error);
          setReports([]);
        }
      } catch (error) {
        console.log("User Error:", error);
      }
    };

    getUser();
  }, []);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loader"></div>
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account information and track your activity.</p>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <h3>{reportsCount}</h3>
          <p>Reports Generated</p>
        </div>

        <div className="profile-stat">
          <h3>{avgScore}%</h3>
          <p>Average Score</p>
        </div>

        <div className="profile-stat">
          <h3>{resumeCount}</h3>
          <p>ATS Resumes</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.username
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U"}
        </div>

        <h2>{user.username}</h2>

        <p className="profile-role">
          Member since {new Date(user.createdAt).getFullYear()}
        </p>

        <div className="profile-info">
          <div className="info-item">
            <span>📧 Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="info-item">
            <span>🆔 User ID</span>
            <div className="id-copy">
              <strong>{user._id}</strong>

              <button onClick={() => navigator.clipboard.writeText(user._id)}>
                Copy
              </button>
            </div>
          </div>

          <div className="info-item">
            <span>📅 Joined</span>
            <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
          </div>

          <div className="info-item">
            <span>📅 Account Status</span>
            <strong>Active</strong>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-btn" onClick={() => navigate("/reports")}>
            📄 Reports
          </button>

          <button
            className="security-btn"
            onClick={() => navigate("/ats-resume")}
          >
            📑 ATS Resume
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="activity-card">
        <h2>Recent Reports</h2>

        {reports.slice(0, 3).map((report) => (
          <div key={report._id} className="activity-item">
            📄 {report.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
