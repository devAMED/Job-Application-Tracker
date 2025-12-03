import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { registerUser } from "../api/authApi.js";

export default function RegisterPage() {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    // role: "user"
  });

  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin/jobs" : "/user/jobs"} replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await registerUser(form);
      // auto-login after registration
      login(data.user, data.token);

      if (data.user.role === "admin") {
        navigate("/admin/jobs");
      } else {
        navigate("/user/jobs");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Registration failed. Try another email.";
      setError(msg);
    }
  };

  return (
    // Outer container: full height under navbar + centered content
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {/* Card-like box for the register form */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "1.75rem 1.9rem",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem" }}>Register</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Name
              <br />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
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

          <div style={{ marginBottom: "0.5rem" }}>
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

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" style={{ marginTop: "0.5rem" }}>
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
