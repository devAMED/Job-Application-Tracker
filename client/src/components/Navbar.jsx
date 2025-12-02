import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "0.75rem 1rem",
        marginBottom: "1rem",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link
          to={
            isAuthenticated
              ? role === "admin"
                ? "/admin/jobs"
                : "/user/jobs"
              : "/login"
          }
        >
          <strong>Job Application Tracker</strong>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {isAuthenticated && role === "admin" && (
          <>
            <Link to="/admin/jobs">Jobs</Link>
            <Link to="/admin/applications">Applications</Link>
          </>
        )}

        {isAuthenticated && role === "user" && (
          <>
            <Link to="/user/jobs">Jobs</Link>
            <Link to="/user/applications">My Applications</Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              {user?.email} ({role})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
