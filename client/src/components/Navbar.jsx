import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const homeLink = !isAuthenticated
    ? "/" // Landing page (logo fade in)
    : role === "admin"
      ? "/admin/jobs"
      : "/user/jobs";

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to={homeLink} style={styles.brand}>
          <strong style={{ fontSize: 16 }}>Applico</strong>
        </Link>

        {/* Public links (only when logged out) */}
        {!isAuthenticated && (
          <>
            <Link to="/about" style={styles.link}>About</Link>
            <Link to="/contact" style={styles.link}>Contact</Link>
          </>
        )}

        {/* Logged in links */}
        {isAuthenticated && role === "admin" && (
          <>
            <Link to="/admin/jobs" style={styles.link}>Jobs</Link>
            <Link to="/admin/applications" style={styles.link}>Applications</Link>
          </>
        )}

        {isAuthenticated && role === "user" && (
          <>
            <Link to="/user/jobs" style={styles.link}>Jobs</Link>
            <Link to="/user/applications" style={styles.link}>My Applications</Link>
          </>
        )}
      </div>

      <div style={styles.right}>
        {/* Auth buttons */}
        {!isAuthenticated ? (
          <>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/login" style={styles.link}>Login</Link>
          </>
        ) : (
          <>
            <span style={styles.userTag}>
              {user?.email} ({role})
            </span>
            <button onClick={handleLogout} style={{background: "#111827",     // dark
    color: "#fff",             // white text
    border: "1px solid #111827",
    padding: "0.45rem 0.8rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,}}onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")} >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: 80,
    padding: "0 1.25rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    marginBottom: "1rem",
  },
  left: { display: "flex", gap: "0.9rem", alignItems: "center" },
  right: { display: "flex", gap: "0.9rem", alignItems: "center" },
  brand: { textDecoration: "none", color: "#111827" },
  link: { textDecoration: "none", color: "#111827", opacity: 0.85 },
  userTag: { fontSize: "0.9rem", opacity: 0.75 },
  btn: {
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
  },
};
