import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  //get auth info from context
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();
// When user clicks "Logout", clear auth and go back to login page
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
          {/* Left side: logo / app name */}
          <strong>Job Application Tracker</strong>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {/* If not logged in, show Login/Register links */}
        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {/* If admin is logged in, show admin links */}
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
