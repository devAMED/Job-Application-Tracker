// client/src/components/ApplicationList.jsx
import React from "react";

const STATUS_COLORS = {
  pending: "gray",
  reviewed: "blue",
  accepted: "green",
  rejected: "red",
};

function StatusBadge({ status }) {
  const bg = STATUS_COLORS[status] || "gray";
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: "999px",
        background: bg,
        color: "white",
        fontSize: "0.75rem",
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

function ApplicationList({ applications, forRole = "admin", onStatusChange }) {
  if (!applications || applications.length === 0) {
    return <p>No applications found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {forRole === "admin" && <th>Applicant</th>}
          <th>Job</th>
          <th>Status</th>
          <th>Applied At</th>
          {forRole === "admin" && <th>Change Status</th>}
        </tr>
      </thead>
      <tbody>
        {applications.map(app => (
          <tr key={app._id}>
            {forRole === "admin" && (
              <td>
                {app.user?.name}
                <br />
                <small>{app.user?.email}</small>
              </td>
            )}

            <td>
              {app.job?.title}
              <br />
              <small>{app.job?.company}</small>
            </td>

            <td>
              <StatusBadge status={app.status} />
            </td>

            <td>{new Date(app.createdAt).toLocaleString()}</td>

            {forRole === "admin" && (
              <td>
                <select
                  value={app.status}
                  onChange={e => onStatusChange(app._id, e.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="reviewed">reviewed</option>
                  <option value="accepted">accepted</option>
                  <option value="rejected">rejected</option>
                </select>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApplicationList;
