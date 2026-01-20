// client/src/App.jsx
//main app shell with navbar, routing, etc
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import ApplyFormPage from "./pages/ApplyFormPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth.jsx";
import Navbar from "./components/Navbar.jsx";
//auth pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
//admin
import AdminJobsPage from "./pages/AdminJobsPage.jsx";
import AdminApplicationsPage from "./pages/AdminApplicationsPage.jsx";
//user
import UserJobsPage from "./pages/UserJobsPage.jsx";
import UserApplicationsPage from "./pages/UserApplicationsPage.jsx";

//protext the routes so only logged in users can access
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
//while restoring from localstorage, show a temp message
  if (loading) return <p>Loading...</p>;
  //if not logged in, send to login page
  if (!isAuthenticated) return <Navigate to="/login" replace />;
//if logged in render the requested page
  return children;
};
//this restricts certain routes to specific roles
const RoleRoute = ({ allowedRoles, children }) => {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    // If user has wrong role, send them to their default home
    if (role === "admin") return <Navigate to="/admin/jobs" replace />;
    if (role === "user") return <Navigate to="/user/jobs" replace />;
    return <Navigate to="/login" replace />;
  }
//role is allowed render the page
  return children;
};

export default function App() {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "1rem" }}>
        <Routes>
          {/* Public routes */}
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

          {/* User routes */}
          <Route
            path="/user/jobs"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user", "admin"]}>
                  <UserJobsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/applications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user", "admin"]}>
                  <UserApplicationsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs/:jobId"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user", "admin"]}>
                  <JobDetailsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs/:jobId/apply"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["user", "admin"]}>
                  <ApplyFormPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}
