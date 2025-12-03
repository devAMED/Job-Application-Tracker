// client/src/pages/UserApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import { getMyApplications } from "../api/applicationsApi";
import ApplicationList from "../components/ApplicationList";

function UserApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await getMyApplications();
      setApps(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <ApplicationList applications={apps} forRole="user" />
        )}
      </div>
    </div>
  );
}

export default UserApplicationsPage;