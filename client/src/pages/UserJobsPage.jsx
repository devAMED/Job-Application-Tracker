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
    <div>
      <h2>Available Jobs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
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
  );
}

export default UserJobsPage;
