// client/src/pages/UserApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import {
  addNoteToApplication,
  getMyApplications,
  getMyApplicationsAnalytics,
  updateApplicationTracking,
} from "../api/applicationsApi";
import ApplicationList from "../components/ApplicationList";

function UserApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const [data, a] = await Promise.all([
        getMyApplications(),
        getMyApplicationsAnalytics(),
      ]);
      setApps(data);
      setAnalytics(a);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTracking(appId, patch) {
    try {
      await updateApplicationTracking(appId, patch);
      await load();
    } catch (err) {
      setError(err.message || "Failed to update tracking");
    }
  }

  async function handleAddNote(appId, text) {
    try {
      await addNoteToApplication(appId, text);
      await load();
    } catch (err) {
      setError(err.message || "Failed to add note");
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
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>My Applications</h2>

        {analytics && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.9rem 1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.9rem",
              background: "#fafafa",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Total</div>
              <div style={{ fontWeight: 700 }}>{analytics.total}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Response rate</div>
              <div style={{ fontWeight: 700 }}>
                {Math.round(analytics.responseRate || 0)}%

              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Avg response time</div>
              <div style={{ fontWeight: 700 }}>
                {analytics.avgResponseTimeDays === null
                  ? "—"
                  : `${analytics.avgResponseTimeDays} days`}
              </div>
            </div>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
          <p>Loading applications...</p>
        ) : (
         <div style={{ width: "100%", overflowX: "auto" }}>
  <div style={{ minWidth: 980 }}>
    <ApplicationList
      applications={apps}
      forRole="user"
      onUpdateTracking={handleUpdateTracking}
      onAddNote={handleAddNote}
    />
  </div>
</div>

        )}
      </div>
    </div>
  );
}

export default UserApplicationsPage;