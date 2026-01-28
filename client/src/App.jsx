// client/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth.jsx";
import Navbar from "./components/Navbar.jsx";

// Public pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Core pages
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import ApplyFormPage from "./pages/ApplyFormPage.jsx";

// Admin
import AdminJobsPage from "./pages/AdminJobsPage.jsx";
import AdminApplicationsPage from "./pages/AdminApplicationsPage.jsx";
import AdminApplicationDetailsPage from "./pages/AdminApplicationDetailsPage.jsx";

// User
import UserJobsPage from "./pages/UserJobsPage.jsx";
import UserApplicationsPage from "./pages/UserApplicationsPage.jsx";
import UserApplicationDetailsPage from "./pages/UserApplicationDetailsPage.jsx";

// New pages (you will add these files below)
import LandingPage from "./pages/LandingPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

// Protect routes: only logged in users can access
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Restrict by role
const RoleRoute = ({ allowedRoles, children }) => {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin/jobs" replace />;
    if (role === "user") return <Navigate to="/user/jobs" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <div>
      <Navbar />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "1rem" }}>
        <Routes>
          {/* Landing: if logged in -> go to dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  to={role === "admin" ? "/admin/jobs" : "/user/jobs"}
                  replace
                />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Public static pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin routes */}
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminJobsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminApplicationsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications/:id"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminApplicationDetailsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* User routes */}
          <Route
            path="/user/jobs"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user"]}>
                  <UserJobsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs/:jobId"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user"]}>
                  <JobDetailsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs/:jobId/apply"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user"]}>
                  <ApplyFormPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/applications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user"]}>
                  <UserApplicationsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/applications/:id"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user"]}>
                  <UserApplicationDetailsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
