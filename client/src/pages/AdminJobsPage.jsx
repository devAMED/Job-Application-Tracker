// client/src/pages/AdminJobsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getJobs, createJob, updateJob, deleteJob } from "../api/JobsApi";
import JobList from "../components/JobList";
import JobForm from "../components/JobForm";

function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (editingJob) {
      setFormOpen(true);
    }
  }, [editingJob]);

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

  async function handleSave(jobData) {
    try {
      if (editingJob) {
        const updated = await updateJob(editingJob._id, jobData);
        setJobs(prev => prev.map(j => (j._id === updated._id ? updated : j)));
      } else {
        const created = await createJob(jobData);
        setJobs(prev => [created, ...prev]);
      }
      setEditingJob(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save job");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to delete job");
    }
  }

  const jobMetrics = useMemo(() => {
    if (!jobs.length) return { companies: 0, newThisMonth: 0 };
    const companies = new Set(jobs.map(j => j.company)).size;
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const newThisMonth = jobs.filter(job => {
      if (!job.createdAt) return false;
      const created = new Date(job.createdAt);
      return created.getMonth() === month && created.getFullYear() === year;
    }).length;
    return { companies, newThisMonth };
  }, [jobs]);

  const formatSalary = (job) => {
    if (!job) return "—";
    if (job.salaryMin || job.salaryMax) {
      return `${job.salaryMin ? `$${job.salaryMin}` : ""}${
        job.salaryMin && job.salaryMax ? " - " : ""
      }${job.salaryMax ? `$${job.salaryMax}` : ""}`;
    }
    return "—";
  };

  return (
    // Outer container: centers the admin jobs "card" on the page
    <div
      style={{
        minHeight: "calc(100vh - 80px)", // viewport height minus navbar
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2.5rem 1.25rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.1rem",
          padding: "1.9rem 2.2rem",
          boxShadow: "0 22px 45px rgba(15, 23, 42, 0.14)",
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "1000px",
          overflow: "hidden",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginBottom: "0.25rem" }}>Admin – Manage Jobs</h2>
        </div>

        {error && <p style={{ color: "red", marginBottom: "0.7rem" }}>{error}</p>}

        <div style={{ display: "grid", gap: "1.5rem" }}>
          <section
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "1rem",
              background: "#f1f5f9",
              padding: "1rem 1.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => setFormOpen((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: "36px",
                  height: "36px",
                  borderRadius: "999px",
                  background: "#e5e7eb",
                  color: "#000",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  transform: formOpen ? "rotate(45deg)" : "none",
                  transition: "transform 0.25s ease",
                }}
              >
                +
              </span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#000" }}>
                  {editingJob ? "Update existing job" : "Create a new job"}
                </p>
                <small style={{ color: "#6b7280" }}>
                  Click to {formOpen ? "hide" : "show"} job fields
                </small>
              </div>
            </button>
            <div
              style={{
                marginTop: "1.25rem",
                maxHeight: formOpen ? "1200px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}
            >
              <JobForm
                onSubmit={handleSave}
                initialJob={editingJob}
                onCancel={() => setEditingJob(null)}
              />
            </div>
          </section>

          <section
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "1rem",
              padding: "1.25rem",
              background: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>All jobs</h3>
              <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                Showing {jobs.length} role{jobs.length === 1 ? "" : "s"}
              </span>
            </div>
            {loading ? (
              <p style={{ marginTop: "1rem" }}>Loading jobs...</p>
            ) : (
              <div style={{ marginTop: "1rem", overflowX: "auto" }}>
                <JobList
                  jobs={jobs}
                  onEdit={setEditingJob}
                  onDelete={handleDelete}
                  showActionsFor="admin"
                />
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

export default AdminJobsPage;
