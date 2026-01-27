// client/src/components/ApplicationList.jsx
import React from "react";

const STATUS_COLORS = {
  submitted: "teal",
  pending: "gray",
  under_review: "orange",
  reviewed: "blue",
  shortlisted: "dodgerblue",
  phone_screen: "slateblue",
  interview: "purple",
  offer: "goldenrod",
  hired: "green",
  rejected: "red",
  accepted: "green",
};

function StatusBadge({ status }) {
  const safeStatus = status || "pending";
  const bg = STATUS_COLORS[safeStatus] || "gray";
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
      {safeStatus}
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
                  <option value="submitted">submitted</option>
                  <option value="under_review">under_review</option>
                  <option value="shortlisted">shortlisted</option>
                  <option value="phone_screen">phone_screen</option>
                  <option value="interview">interview</option>
                  <option value="offer">offer</option>
                  <option value="hired">hired</option>
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
