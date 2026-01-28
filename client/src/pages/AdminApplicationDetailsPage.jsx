import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addAdminNoteToApplication,
  getApplicationByIdAdmin,
  updateApplicationStatus,
  updateInterviewAdmin,
} from "../api/applicationsApi";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under review" },
  { value: "phone_screen", label: "Phone screen" },
  { value: "technical_interview", label: "Technical interview" },
  { value: "hr_interview", label: "HR interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminApplicationDetailsPage() {
  const { id } = useParams(); // application id
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // editable fields
  const [status, setStatus] = useState("pending");
  const [interviewAt, setInterviewAt] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  const [noteText, setNoteText] = useState("");

  const isInterviewStage = useMemo(() => {
    const s = (status || "").toLowerCase();
    return s.includes("interview");
  }, [status]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await getApplicationByIdAdmin(id);
      setApp(data);

      setStatus(data.status || "pending");

      // convert interviewAt -> datetime-local string
      setInterviewAt(data.interviewAt ? toLocalInputValue(data.interviewAt) : "");
      setInterviewLocation(data.interviewLocation || "");
      setInterviewLink(data.interviewLink || "");
      setInterviewNotes(data.interviewNotes || "");
    } catch (e) {
      setError(e.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  }

  async function saveStatus() {
    try {
      setSaving(true);
      setError("");
      const updated = await updateApplicationStatus(id, status);
      setApp(updated);
    } catch (e) {
      setError(e.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  async function saveInterview() {
    try {
      setSaving(true);
      setError("");

      const payload = {
        interviewAt: interviewAt ? new Date(interviewAt).toISOString() : null,
        interviewLocation,
        interviewLink,
        interviewNotes,
      };

      const updated = await updateInterviewAdmin(id, payload);
      setApp(updated);
    } catch (e) {
      setError(e.message || "Failed to update interview");
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    try {
      if (!noteText.trim()) return;
      setSaving(true);
      setError("");
      const updated = await addAdminNoteToApplication(id, noteText.trim());
      setApp(updated);
      setNoteText("");
    } catch (e) {
      setError(e.message || "Failed to add note");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Loading application…</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;
  if (!app) return <div style={{ padding: 24 }}>Not found.</div>;

  const job = app.job;
  const user = app.user;

  return (
    <div style={{ padding: "2rem 1.25rem", maxWidth: 980, margin: "0 auto" }}>
      <div style={{ marginBottom: 14 }}>
        <Link to="/admin/applications" style={{ textDecoration: "underline" }}>
          ← Back to applications
        </Link>
      </div>

      <h2 style={{ marginTop: 0 }}>Application Details</h2>

      <div style={{ display: "grid", gap: 14 }}>
        {/* Applicant */}
        <section style={cardStyle}>
          <h3 style={h3Style}>Applicant</h3>
          <p style={pStyle}><strong>Name:</strong> {app.fullName}</p>
          <p style={pStyle}><strong>Email:</strong> {user?.email || "—"}</p>
          <p style={pStyle}><strong>Phone:</strong> {app.phone}</p>
          <p style={pStyle}>
            <strong>LinkedIn:</strong>{" "}
            {app.linkedin ? (
              <a href={app.linkedin} target="_blank" rel="noreferrer">
                {app.linkedin}
              </a>
            ) : (
              "—"
            )}
          </p>
          <p style={pStyle}><strong>Extra Notes:</strong> {app.extraNotes || "—"}</p>
        </section>

        {/* Job */}
        <section style={cardStyle}>
          <h3 style={h3Style}>Job</h3>
          <p style={pStyle}><strong>Title:</strong> {job?.title}</p>
          <p style={pStyle}><strong>Company:</strong> {job?.company}</p>
          <p style={pStyle}><strong>Location:</strong> {job?.location}</p>
          <p style={pStyle}><strong>Description:</strong> {job?.description}</p>
        </section>

        {/* Status */}
        <section style={cardStyle}>
          <h3 style={h3Style}>Status</h3>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <button onClick={saveStatus} disabled={saving}>
              Save status
            </button>
          </div>
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <span style={{ opacity: 0.75, fontSize: 13 }}>
              Response tracking: when leaving “pending”, we record respondedAt for analytics.
            </span>
          </div>
        </section>

        {/* Interview scheduling (only show strongly when interview stage, but still editable) */}
        <section style={cardStyle}>
          <h3 style={h3Style}>
            Interview Scheduling {isInterviewStage ? "" : <span style={{ opacity: 0.6 }}>(optional)</span>}
          </h3>

          <div style={{ display: "grid", gap: 10 }}>
            <label>
              Interview date & time
              <input
                type="datetime-local"
                value={interviewAt}
                onChange={(e) => setInterviewAt(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label>
              Location (or “Online”)
              <input
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
                placeholder="Office address / Online / etc."
                style={inputStyle}
              />
            </label>

            <label>
              Zoom/Meet link (optional)
              <input
                value={interviewLink}
                onChange={(e) => setInterviewLink(e.target.value)}
                placeholder="https://zoom.us/..."
                style={inputStyle}
              />
            </label>

            <label>
              Interview notes (visible to user)
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="What to prepare, who to meet, instructions…"
                style={{ ...inputStyle, minHeight: 90 }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={saveInterview} disabled={saving}>
                Save interview info
              </button>
              <button onClick={() => navigate(0)} style={{ opacity: 0.8 }}>
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Notes thread */}
        <section style={cardStyle}>
          <h3 style={h3Style}>Notes</h3>

          {app.notes?.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {app.notes.map((n, idx) => (
                <div key={idx} style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
                    {n.authorRole?.toUpperCase()} • {new Date(n.createdAt).toLocaleString()}
                  </div>
                  <div>{n.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.7 }}>No notes yet.</p>
          )}

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add an admin note…"
              style={{ ...inputStyle, minHeight: 80 }}
            />
            <div style={{ textAlign: "center" }}>
              <button onClick={addNote} disabled={saving || !noteText.trim()} style={{ minWidth: 140 }}>
                Add note
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function toLocalInputValue(dateOrString) {
  const d = new Date(dateOrString);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 12px 24px rgba(15,23,42,0.06)",
};

const h3Style = { marginTop: 0, marginBottom: 10 };
const pStyle = { margin: "6px 0" };
const inputStyle = { display: "block", width: "100%", marginTop: 6 };
