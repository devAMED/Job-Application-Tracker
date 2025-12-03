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
    <div>
      <h2>My Applications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <ApplicationList applications={apps} forRole="user" />
      )}
    </div>
  );
}

export default UserApplicationsPage;
