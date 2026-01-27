// client/src/components/JobList.jsx
import React from "react";
import { Link } from "react-router-dom";

function prettyStatus(status) {
  if (!status) return "Applied";
  const s = String(status).toLowerCase();

  // Customize the labels you want users to see
  if (s === "pending" || s === "under_review") return "Under review";
  if (s === "rejected") return "Rejected";
  if (s === "offer") return "Offer";
  if (s.includes("interview")) return "Interview stage";
  if (s === "phone_screen") return "Phone screen";
  return "Applied";
}

function JobList({
  jobs,
  onEdit,
  onDelete,
  onApply,
  showActionsFor = "admin",
  appliedMap = {},
}) {
  if (!jobs || jobs.length === 0) {
    return <p>No jobs found.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "10px" }}>Title</th>
          <th style={{ textAlign: "left", padding: "10px" }}>Company</th>
          <th style={{ textAlign: "left", padding: "10px" }}>Location</th>
          <th style={{ textAlign: "left", padding: "10px" }}>Salary</th>
          <th style={{ textAlign: "left", padding: "10px" }}>Description</th>
          <th style={{ textAlign: "left", padding: "10px" }}>Posted</th>
          {showActionsFor === "admin" && <th style={{ padding: "10px" }}>Actions</th>}
          {showActionsFor === "user" && <th style={{ padding: "10px" }}>Apply</th>}
        </tr>
      </thead>

      <tbody>
        {jobs.map((job) => {
          const hasKey = Object.prototype.hasOwnProperty.call(appliedMap || {}, job._id);
          const status = appliedMap?.[job._id];
          const alreadyApplied = hasKey;

          return (
            <tr key={job._id} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>
                {showActionsFor === "admin" ? (
                  <span>{job.title}</span>
                ) : (
                  <Link
                    to={`/user/jobs/${job._id}`}
                    style={{ textDecoration: "underline" }}
                  >
                    {job.title}
                  </Link>
                )}
              </td>

              <td style={{ padding: "10px" }}>{job.company}</td>
              <td style={{ padding: "10px" }}>{job.location}</td>
              <td style={{ padding: "10px" }}>
                {job.salaryMin || job.salaryMax
                  ? `${job.salaryMin ? `$${job.salaryMin}` : ""}${
                      job.salaryMin && job.salaryMax ? " - " : ""
                    }${job.salaryMax ? `$${job.salaryMax}` : ""}`
                  : "—"}
              </td>
              <td style={{ padding: "10px" }}>{job.description}</td>
              <td style={{ padding: "10px" }}>
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
              </td>

              {showActionsFor === "admin" && (
                <td style={{ padding: "10px" }}>
                  <button onClick={() => onEdit(job)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => onDelete(job._id)}>Delete</button>
                </td>
              )}

              {showActionsFor === "user" && (
                <td style={{ padding: "10px" }}>
                  {alreadyApplied ? (
                    <button disabled style={{ opacity: 0.7, cursor: "not-allowed" }}>
                      {prettyStatus(status)}
                    </button>
                  ) : (
                    <button onClick={() => onApply(job)}>Apply</button>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default JobList;
