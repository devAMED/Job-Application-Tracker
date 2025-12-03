// client/src/pages/AdminApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../api/applicationsApi";
import ApplicationList from "../components/ApplicationList";

function AdminApplicationsPage() {
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
    <div>
      <h2>Admin – Applications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
  );
}

export default AdminApplicationsPage;
