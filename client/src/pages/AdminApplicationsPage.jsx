// client/src/pages/AdminApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../api/applicationsApi";
import ApplicationList from "../components/ApplicationList";

function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await getAllApplications();
      setApps(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateApplicationStatus(id, status);
      setApps(prev => prev.map(a => (a._id === id ? updated : a)));
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update status");
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2.5rem 1.25rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.1rem",
          padding: "2rem 2.2rem",
          boxShadow: "0 22px 45px rgba(15, 23, 42, 0.14)",
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "1000px",
          overflow: "hidden",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Admin – Applications</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <p>Loading applications...</p>
          ) : (
            <ApplicationList
              applications={apps}
              forRole="admin"
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminApplicationsPage;
