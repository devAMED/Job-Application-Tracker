// client/src/components/ApplicationList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
        padding: "6px 10px",
        borderRadius: "999px",
        background: bg,
        color: "white",
        fontSize: "0.78rem",
        fontWeight: 600,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
        boxShadow: `0 6px 15px ${bg}44`,
      }}
    >
      {label}
    </span>
  );
}

function toLocalDateTimeValue(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function formatNice(dt) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return "—";
  }
}

function ApplicationList({
  applications,
  forRole = "user",
  onStatusChange,     // admin only
  onUpdateTracking,   // user: reminderAt / extraNotes only
  onAddNote,          // user: add note
}) {
  if (!applications || applications.length === 0) {
    return <p>No applications found.</p>;
  }

  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [noteDrafts, setNoteDrafts] = useState({});

  const initialDrafts = useMemo(() => {
    const map = {};
    for (const a of applications) {
      map[a._id] = {
        reminderAt: toLocalDateTimeValue(a.reminderAt),
      };
    }
    return map;
  }, [applications]);

  useEffect(() => {
    setTrackingDrafts((prev) => {
      const next = { ...prev };
      for (const [id, v] of Object.entries(initialDrafts)) {
        if (!next[id]) next[id] = v;
      }
      return next;
    });
  }, [initialDrafts]);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", borderSpacing: 0 }}>
      <thead>
        <tr style={{ textAlign: "left", background: "#f8fafc" }}>
          {forRole === "admin" && <th style={{ padding: "12px 14px" }}>Applicant</th>}
          <th style={{ padding: "12px 14px" }}>Job</th>
          <th style={{ padding: "12px 14px", textAlign: "center" }}>Status</th>
          <th style={{ padding: "12px 14px" }}>Applied At</th>

          {forRole === "user" && <th style={{ padding: "12px 14px" }}>Interview (read-only)</th>}
          {forRole === "user" && <th style={{ padding: "12px 14px" }}>Reminder</th>}
          {forRole === "user" && <th style={{ padding: "12px 14px" }}>Notes</th>}

          {forRole === "admin" && <th style={{ padding: "12px 14px", textAlign: "center" }}>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {applications.map((app) => (
          <tr key={app._id} style={{ borderTop: "1px solid #e5e7eb" }}>
            {forRole === "admin" && (
              <td style={{ padding: "14px", verticalAlign: "top" }}>
                <div style={{ fontWeight: 600 }}>{app.user?.name || "—"}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{app.user?.email || "—"}</div>
              </td>
            )}

            <td style={{ padding: "14px", verticalAlign: "top" }}>
              <div style={{ fontWeight: 600 }}>{app.job?.title || "—"}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{app.job?.company || "—"}</div>

              {forRole === "admin" && (
                <div style={{ marginTop: 6 }}>
                  <Link
                    to={`/admin/applications/${app._id}`}
                    style={{ textDecoration: "underline", fontSize: 12 }}
                  >
                    View application →
                  </Link>
                </div>
              )}
            </td>

            <td
              style={
                forRole === "user"
                  ? { padding: "14px", minWidth: 420, verticalAlign: "top" }
                  : { padding: "14px", textAlign: "center", verticalAlign: "middle" }
              }
            >
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
                        (Only admin updates this)
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

            <td style={{ padding: "14px", verticalAlign: "top" }}>{formatNice(app.createdAt)}</td>

            {/* USER: interview info read-only */}
            {forRole === "user" && (
              <td style={{ padding: "14px", minWidth: 260, verticalAlign: "top" }}>
                <div style={{ fontSize: 13 }}>
                  <div>
                    <strong>Date:</strong> {formatNice(app.interviewAt)}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <strong>Location / Link:</strong>{" "}
                    {app.interviewLocation ? app.interviewLocation : "—"}
                  </div>
                  {app.interviewLink ? (
                    <div style={{ marginTop: 6 }}>
                      <a href={app.interviewLink} target="_blank" rel="noreferrer">
                        Open meeting link
                      </a>
                    </div>
                  ) : null}
                  {app.interviewNotes ? (
                    <div style={{ marginTop: 6 }}>
                      <strong>Admin notes:</strong> {app.interviewNotes}
                    </div>
                  ) : null}
                  <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                    (Admin sets this when you reach interview stage)
                  </div>
                </div>
              </td>
            )}

            {/* USER: reminders (editable) */}
            {forRole === "user" && (
              <td style={{ padding: "14px", minWidth: 220 }}>
                <input
                  type="datetime-local"
                  value={trackingDrafts?.[app._id]?.reminderAt || ""}
                  onChange={(e) =>
                    setTrackingDrafts((p) => ({
                      ...p,
                      [app._id]: { ...(p[app._id] || {}), reminderAt: e.target.value },
                    }))
                  }
                  style={{ width: "100%" }}
                />
                {onUpdateTracking && (
                  <button
                    onClick={() =>
                      onUpdateTracking(app._id, {
                        reminderAt: trackingDrafts?.[app._id]?.reminderAt || "",
                      })
                    }
                    style={{ marginTop: 6, width: "100%" }}
                  >
                    Save reminder
                  </button>
                )}
              </td>
            )}

            {/* USER: notes (editable) */}
            {forRole === "user" && (
              <td style={{ padding: "14px", minWidth: 300 }}>
                <div style={{ fontSize: "0.85rem", color: "#374151", marginBottom: 6 }}>
                  {app.notes?.length ? `${app.notes.length} note(s)` : "No notes yet"}
                </div>

                <input
                  placeholder="Add a note..."
                  value={noteDrafts?.[app._id] || ""}
                  onChange={(e) =>
                    setNoteDrafts((p) => ({ ...p, [app._id]: e.target.value }))
                  }
                  style={{ width: "100%" }}
                />

                {onAddNote && (
                  <button
                    onClick={() => {
                      const text = (noteDrafts?.[app._id] || "").trim();
                      if (!text) return;
                      onAddNote(app._id, text);
                      setNoteDrafts((p) => ({ ...p, [app._id]: "" }));
                    }}
                    style={{ marginTop: 6, width: "100%" }}
                  >
                    Add note
                  </button>
                )}

                {app.notes?.length ? (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ cursor: "pointer" }}>View notes</summary>
                    <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                      {app.notes
                        .slice()
                        .reverse()
                        .slice(0, 8)
                        .map((n, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            {n.text}{" "}
                            <small style={{ color: "#6b7280" }}>
                              ({formatNice(n.createdAt)})
                            </small>
                          </li>
                        ))}
                    </ul>
                  </details>
                ) : null}
              </td>
            )}

            {/* ADMIN: status dropdown + view */}
            {forRole === "admin" && (
              <td style={{ padding: "14px", minWidth: 220, textAlign: "center", verticalAlign: "middle" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      position: "relative",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: STATUS_COLORS[app.status] || "#e5e7eb",
                      boxShadow: `0 0 0 6px ${STATUS_COLORS[app.status] || "#f3f4f6"}20`,
                    }}
                  ></div>
                  <select
                    value={app.status || "pending"}
                    onChange={(e) => onStatusChange(app._id, e.target.value)}
                    style={{
                      minWidth: 180,
                      maxWidth: "100%",
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      background: "#f8fafc",
                    }}
                  >
                    <option value="pending">pending</option>
                    <option value="under_review">under_review</option>
                    <option value="phone_screen">phone_screen</option>
                    <option value="technical_interview">technical_interview</option>
                    <option value="hr_interview">hr_interview</option>
                    <option value="offer">offer</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApplicationList;
