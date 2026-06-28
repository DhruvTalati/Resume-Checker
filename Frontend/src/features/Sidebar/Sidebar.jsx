import { useNavigate, useLocation } from "react-router";
import api from "../../api/axios";
import "./sidebar.scss";

const NAV = [
  { label: "Dashboard", icon: "📊", path: "/dashboard" },
  { label: "Generate Report", icon: "✨", path: "/" },
  { label: "Reports", icon: "📄", path: "/reports" },
  { label: "ATS Resume", icon: "📑", path: "/ats-resume" },
  { label: "Profile", icon: "👤", path: "/profile" },
];

const Sidebar = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const initials =
    user?.username
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      <div
        className={`sb-overlay ${open ? "sb-overlay--vis" : ""}`}
        onClick={onClose}
      />
      <aside className={`sb ${open ? "sb--open" : ""}`}>
        {/* Brand */}
        <div className="sb__brand">
          <div className="sb__mark">R</div>
          <span className="sb__name">ResumeAI</span>
        </div>

        {/* Nav */}
        <nav className="sb__nav">
          {NAV.map((item) => (
            <button
              key={item.path}
              className={`sb__item ${location.pathname === item.path ? "sb__item--active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span className="sb__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sb__footer">
          <button className="sb__item sb__item--danger" onClick={handleLogout}>
            <span className="sb__icon">🚪</span>
            Logout
          </button>
          <div className="sb__user">
            <div className="sb__avatar">{initials}</div>
            <div>
              <div className="sb__username">{user?.username || "User"}</div>
              <div className="sb__role">ResumeAI Member</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
