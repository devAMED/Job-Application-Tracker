// client/src/pages/UserJobsPage.jsx
import React, { useEffect, useState } from "react";
import { getJobs } from "../api/JobsApi";
import { applyToJob } from "../api/applicationsApi";
import JobList from "../components/JobList";

function UserJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(job) {
    try {
      setMessage("");
      await applyToJob(job._id, "Applying from user dashboard");
      setMessage(`Applied to ${job.title}`);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to apply");
    }
  }

return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)", // aligns content below navbar
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
          maxWidth: "900px",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Available Jobs</h2>

        {error && <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}
        {message && <p style={{ color: "green", marginBottom: "0.5rem" }}>{message}</p>}

        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <JobList
            jobs={jobs}
            showActionsFor="user"
            onApply={handleApply}
          />
        )}
      </div>
    </div>
  );
}

export default UserJobsPage;