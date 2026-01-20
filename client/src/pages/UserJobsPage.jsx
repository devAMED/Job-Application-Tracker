// client/src/pages/UserJobsPage.jsx
import React, { useEffect, useState } from "react";
import { getJobs } from "../api/JobsApi";
import { getMyApplicationsSummary } from "../api/applicationsApi";
import JobList from "../components/JobList";
import { useNavigate } from "react-router-dom";

function UserJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [appliedMap, setAppliedMap] = useState({}); // { [jobId]: status }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPage() {
    try {
      setLoading(true);
      setError("");

      const jobsData = await getJobs();
      setJobs(jobsData || []);

      // If user is not logged in, this may 401 and auto-redirect to /login via apiClient.
      // If logged in, we’ll get summary.
      const summary = await getMyApplicationsSummary();
      const map = {};
      (summary || []).forEach((item) => {
        // backend returns { jobId, status }
        map[item.jobId] = item.status;
      });
      setAppliedMap(map);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  function handleApply(job) {
    navigate(`/user/jobs/${job._id}/apply`);
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
          maxWidth: "900px",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Available Jobs</h2>

        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
        )}
        {message && (
          <p style={{ color: "green", marginBottom: "0.5rem" }}>{message}</p>
        )}

        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <JobList
            jobs={jobs}
            showActionsFor="user"
            onApply={handleApply}
            appliedMap={appliedMap}
          />
        )}
      </div>
    </div>
  );
}

export default UserJobsPage;
