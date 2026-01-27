// client/src/components/ApplicationList.jsx
import React from "react";
import StatusBar from "./StatusBar";

const STATUS_COLORS = {
  pending: "gray",
  under_review: "orange",
  phone_screen: "slateblue",
  technical_interview: "purple",
  hr_interview: "teal",
  offer: "goldenrod",
  rejected: "red",
};

const STATUS_LABELS = {
  pending: "Pending",
  under_review: "Under Review",
  phone_screen: "Phone Screen",
  technical_interview: "Technical Interview",
  hr_interview: "HR Interview",
  offer: "Offer",
  rejected: "Rejected",
};

function StatusBadge({ status }) {
  const safeStatus = status || "pending";
  const bg = STATUS_COLORS[safeStatus] || "gray";
  const label = STATUS_LABELS[safeStatus] || STATUS_LABELS.pending;
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
      {label}
    </span>
  );
}

function ApplicationList({ applications, forRole = "user", onStatusChange }) {
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

            <td style={forRole === "user" ? { minWidth: "500px" } : undefined}>
              {forRole === "user" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.6rem",
                      background: "#eef2ff",
                      borderRadius: "14px",
                      padding: "0.55rem 0.85rem",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "#4c1d95", fontWeight: 600 }}>
                      Current status
                      <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 400 }}>
                        Track your progress below
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div style={{ marginTop: "0.65rem" }}>
                    <StatusBar status={app.status} statusColors={STATUS_COLORS} />
                  </div>
                </>
              ) : (
                <StatusBadge status={app.status} />
              )}
            </td>

            <td>{new Date(app.createdAt).toLocaleString()}</td>

            {forRole === "admin" && (
              <td>
                <select
                  value={app.status}
                  onChange={e => onStatusChange(app._id, e.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="under_review">under_review</option>
                  <option value="phone_screen">phone_screen</option>
                  <option value="technical_interview">technical_interview</option>
                  <option value="hr_interview">hr_interview</option>
                  <option value="offer">offer</option>
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
