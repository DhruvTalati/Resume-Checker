import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import "../auth.form.scss";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="auth-page">
        <div className="gradient gradient-1"></div>
        <div className="gradient gradient-2"></div>
        <div className="grid-overlay"></div>

        <div className="loader-container">
          <div className="loader"></div>

          <h2>Preparing Your Workspace</h2>

          <p>Loading your dashboard and AI-powered career tools...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;
