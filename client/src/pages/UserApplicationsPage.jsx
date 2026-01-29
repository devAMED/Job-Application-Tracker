// client/src/pages/UserApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications, getMyApplicationsAnalytics } from "../api/applicationsApi";
import StatusBar from "../components/StatusBar";

const STATUS_COLORS = {
  pending: "gray",
  under_review: "orange",
  phone_screen: "slateblue",
  technical_interview: "purple",
  hr_interview: "teal",
  offer: "goldenrod",
  rejected: "crimson",
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
  const safe = status || "pending";
  const bg = STATUS_COLORS[safe] || "gray";
  const label = STATUS_LABELS[safe] || "Pending";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: 999,
        background: bg,
        color: "white",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString();
}

export default function UserApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const [a, an] = await Promise.all([getMyApplications(), getMyApplicationsAnalytics()]);
      setApps(a);
      setAnalytics(an);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load applications");
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
        padding: "2.5rem 1.25rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          background: "#fff",
          borderRadius: 18,
          border: "1px solid #e5e7eb",
          boxShadow: "0 22px 45px rgba(15, 23, 42, 0.14)",
          padding: "1.75rem 1.75rem",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>My Applications</h2>

        {analytics && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div
              style={{
                padding: "0.9rem 1rem",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                background: "#fafafa",
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Total</div>
                <div style={{ fontWeight: 800 }}>{analytics.total ?? 0}</div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Response rate</div>
                <div style={{ fontWeight: 800 }}>{analytics.responseRate ?? 0}%</div>
              </div>
            </div>
          </div>
        )}

        {error && <p style={{ color: "crimson", marginTop: 0 }}>{error}</p>}

        {loading ? (
          <p>Loading…</p>
        ) : apps.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <th style={thLeft}>Job</th>
                  <th style={thLeft}>Status</th>
                  <th style={thLeft}>Applied At</th>
                  <th style={thLeft}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {apps.map((app) => (
                  <tr key={app._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                    <td style={td}>
                      <div style={{ fontWeight: 700 }}>{app.job?.title || "—"}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{app.job?.company || ""}</div>

                      <div style={{ marginTop: 8 }}>
                        <Link
                          to={`/user/applications/${app._id}`}
                          style={{ textDecoration: "underline", fontSize: 13 }}
                        >
                          Open details →
                        </Link>
                      </div>
                    </td>

                    <td style={{ ...td, minWidth: 220 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StatusBadge status={app.status} />
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <StatusBar status={app.status} statusColors={STATUS_COLORS} />
                      </div>
                    </td>

                    <td style={td}>{fmt(app.createdAt)}</td>

                    <td style={td}>
                      {/* quick hint (optional) */}
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        Interview: {app.interviewAt ? fmt(app.interviewAt) : "—"}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        Location/Link: {app.interviewLocation || app.interviewLink ? "Set" : "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thLeft = {
  textAlign: "left",
  padding: "12px 12px",
  fontSize: 13,
  color: "#0f172a",
};

const td = {
  padding: "14px 12px",
  verticalAlign: "top",
};
