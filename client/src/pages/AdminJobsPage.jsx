// client/src/pages/AdminJobsPage.jsx
import React, { useEffect, useState } from "react";
import { getJobs, createJob, updateJob, deleteJob } from "../api/JobsApi";
import JobList from "../components/JobList";
import JobForm from "../components/JobForm";

function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      {/* Card container for the admin jobs content */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.1rem",
          padding: "1.9rem 2.2rem",
          boxShadow: "0 22px 45px rgba(15, 23, 42, 0.14)",
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Admin – Manage Jobs</h2>

        {error && <p style={{ color: "red", marginBottom: "0.7rem" }}>{error}</p>}

        <JobForm
          onSubmit={handleSave}
          initialJob={editingJob}
          onCancel={() => setEditingJob(null)}
        />

        {loading ? (
          <p style={{ marginTop: "1rem" }}>Loading jobs...</p>
        ) : (
          <JobList
            jobs={jobs}
            onEdit={setEditingJob}
            onDelete={handleDelete}
            showActionsFor="admin"
          />
        )}
      </div>
    </div>
  );
}

export default AdminJobsPage;