// client/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Temporary placeholder components for teammate 3
const AdminJobsPage = () => <h2>Admin Jobs – to be implemented</h2>;
const AdminApplicationsPage = () => (
  <h2>Admin Applications – to be implemented</h2>
);
const UserJobsPage = () => <h2>User Jobs – to be implemented</h2>;
const UserApplicationsPage = () => (
  <h2>My Applications – to be implemented</h2>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

const RoleRoute = ({ allowedRoles, children }) => {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    // If user has wrong role, send them to their default home
    if (role === "admin") return <Navigate to="/admin/jobs" replace />;
    if (role === "user") return <Navigate to="/user/jobs" replace />;
    return <Navigate to="/login" replace />;
  }

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

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}
