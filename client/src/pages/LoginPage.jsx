import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser } from "../api/authApi.js";

export default function LoginPage() {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
// Form state: controlled inputs for email + password
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
// Form state: controlled inputs for email + password
  const [error, setError] = useState("");
//if already logged in, dont show the form again then redirect to admin or user page
  if (isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin/jobs" : "/user/jobs"} replace />;
  }
//update form state when user types
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
//handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(form);
      // backend: { message, token, user }
      login(data.user, data.token);

      if (data.user.role === "admin") {
        navigate("/admin/jobs");
      } else {
        navigate("/user/jobs");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Invalid email or password.";
      setError(msg);
    }
  };

  return (
    // Outer container: fill viewport under navbar and center the card
    <div
      style={{
        minHeight: "calc(100vh - 80px)", // adjust for navbar height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1.25rem",
      }}
    >
      {/* Card container */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.2rem",
          padding: "2.1rem 2.3rem",
          boxShadow: "0 22px 50px rgba(15, 23, 42, 0.16)",
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "500px", // bigger card
        }}
      >
        <h2 style={{ marginBottom: "0.9rem" }}>Login</h2>
        <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "#6b7280" }}>
          Sign in to manage and track your job applications.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label>
              Email
              <br />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>
              Password
              <br />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {error && <p style={{ color: "red", marginTop: "0.25rem" }}>{error}</p>}

          <button type="submit" style={{ marginTop: "0.75rem" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
