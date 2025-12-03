// client/src/components/JobList.jsx
import React from "react";

function JobList({ jobs, onEdit, onDelete, onApply, showActionsFor = "admin" }) {
  if (!jobs || jobs.length === 0) {
    return <p>No jobs found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Location</th>
          <th>Description</th>
          {showActionsFor === "admin" && <th>Actions</th>}
          {showActionsFor === "user" && <th>Apply</th>}
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job._id}>
            <td>{job.title}</td>
            <td>{job.company}</td>
            <td>{job.location}</td>
            <td>{job.description}</td>

            {showActionsFor === "admin" && (
              <td>
                <button onClick={() => onEdit(job)}>Edit</button>
                <button onClick={() => onDelete(job._id)}>Delete</button>
              </td>
            )}

            {showActionsFor === "user" && (
              <td>
                <button onClick={() => onApply(job)}>Apply</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default JobList;
