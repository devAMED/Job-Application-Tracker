import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getJobById } from "../api/JobsApi";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  async function loadJob() {
    try {
      setLoading(true);
      setError("");
      const data = await getJobById(jobId);
      setJob(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load job details");
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
          maxWidth: "900px",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <Link to="/user/jobs" style={{ textDecoration: "underline" }}>
            ← Back to Jobs
          </Link>
        </div>

        <h2 style={{ marginBottom: "1rem" }}>Job Details</h2>

        {loading && <p>Loading job...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && job && (
          <>
            <h3 style={{ marginBottom: "0.25rem" }}>{job.title}</h3>
            <p style={{ marginTop: 0, opacity: 0.85 }}>
              {job.company} • {job.location}
            </p>

            <div style={{ marginTop: "1rem" }}>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Location type:</strong> {job.locationType || "N/A"}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Job type:</strong> {job.jobType || "N/A"}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Salary:</strong>{" "}
                {job.salaryMin || job.salaryMax
                  ? `${job.salaryMin ? `$${job.salaryMin}` : ""}${
                      job.salaryMin && job.salaryMax ? " - " : ""
                    }${job.salaryMax ? `$${job.salaryMax}` : ""}`
                  : "Not provided"}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Posted:</strong>{" "}
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>

            <div style={{ marginTop: "1.25rem" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>Description</h4>
              <p style={{ lineHeight: 1.6 }}>{job.description || "No description provided."}</p>
            </div>

            {job.about && (
              <div style={{ marginTop: "1.25rem" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>About the role</h4>
                <p style={{ lineHeight: 1.6 }}>{job.about}</p>
              </div>
            )}

            {job.requirements && (
              <div style={{ marginTop: "1.25rem" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>Requirements</h4>
                <ul style={{ paddingLeft: "1.25rem", lineHeight: 1.6 }}>
                  {job.requirements
                    .split("\n")
                    .filter(Boolean)
                    .map((item, idx) => (
                      <li key={idx}>{item.trim()}</li>
                    ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
              <button onClick={() => navigate(`/user/jobs/${jobId}/apply`)}>
                Apply now
              </button>
              <button onClick={() => navigate("/user/jobs")} style={{ opacity: 0.8 }}>
                Back
              </button>
            </div>

            <div style={{ marginTop: "1.25rem", fontSize: "0.9rem", opacity: 0.7 }}>
              (Teammate 3 will enhance this page later with richer fields like salary,
              requirements, and extra sections.)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
