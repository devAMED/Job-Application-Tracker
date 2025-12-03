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
    <div>
      <h2>Admin – Manage Jobs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <JobForm
        onSubmit={handleSave}
        initialJob={editingJob}
        onCancel={() => setEditingJob(null)}
      />
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <JobList
          jobs={jobs}
          onEdit={setEditingJob}
          onDelete={handleDelete}
          showActionsFor="admin"
        />
      )}
    </div>
  );
}

export default AdminJobsPage;
