import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addNoteToApplication,
  getMyApplicationById,
  setReminder,
} from "../api/applicationsApi";

export default function UserApplicationDetailsPage() {
  const { id } = useParams(); // application id

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [noteText, setNoteText] = useState("");
  const [reminderAt, setReminderAt] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyApplicationById(id);
      setApp(data);
      setReminderAt(data.reminderAt ? toLocalInputValue(data.reminderAt) : "");
    } catch (e) {
      setError(e.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  }

  async function addNote() {
    try {
      if (!noteText.trim()) return;
      setSaving(true);
      setError("");
      const updated = await addNoteToApplication(id, noteText.trim());
      setApp(updated);
      setNoteText("");
    } catch (e) {
      setError(e.message || "Failed to add note");
    } finally {
      setSaving(false);
    }
  }

  async function saveReminder() {
    try {
      setSaving(true);
      setError("");
      const updated = await setReminder(id, reminderAt ? new Date(reminderAt).toISOString() : null);
      setApp(updated);
    } catch (e) {
      setError(e.message || "Failed to update reminder");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;
  if (!app) return <div style={{ padding: 24 }}>Not found.</div>;

  return (
    <div style={{ padding: "2rem 1.25rem", maxWidth: 980, margin: "0 auto" }}>
      <div style={{ marginBottom: 14 }}>
        <Link to="/user/applications" style={{ textDecoration: "underline" }}>
          ← Back to my applications
        </Link>
      </div>

      <h2 style={{ marginTop: 0 }}>My Application</h2>

      <section style={cardStyle}>
        <h3 style={h3Style}>Status</h3>
        <p style={{ margin: 0 }}>
          Current status: <strong>{app.status}</strong>
        </p>
      </section>

      <section style={cardStyle}>
        <h3 style={h3Style}>Interview Info</h3>

        {app.interviewAt ? (
          <>
            <p style={pStyle}>
              <strong>Date:</strong> {new Date(app.interviewAt).toLocaleString()}
            </p>
            <p style={pStyle}>
              <strong>Location:</strong> {app.interviewLocation || "—"}
            </p>
            <p style={pStyle}>
              <strong>Link:</strong>{" "}
              {app.interviewLink ? (
                <a href={app.interviewLink} target="_blank" rel="noreferrer">
                  {app.interviewLink}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p style={pStyle}>
              <strong>Notes:</strong> {app.interviewNotes || "—"}
            </p>
          </>
        ) : (
          <p style={{ opacity: 0.7, margin: 0 }}>No interview scheduled yet.</p>
        )}
      </section>

      <section style={cardStyle}>
        <h3 style={h3Style}>Reminder</h3>
        <label>
          Reminder date & time
          <input
            type="datetime-local"
            value={reminderAt}
            onChange={(e) => setReminderAt(e.target.value)}
            style={inputStyle}
          />
        </label>
        <div style={{ marginTop: 10 }}>
          <button onClick={saveReminder} disabled={saving}>
            Save reminder
          </button>
        </div>
      </section>

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
            placeholder="Add your note…"
            style={{ ...inputStyle, minHeight: 80 }}
          />
          <button onClick={addNote} disabled={saving || !noteText.trim()}>
            Add note
          </button>
        </div>
      </section>
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
  marginTop: 14,
  boxShadow: "0 12px 24px rgba(15,23,42,0.06)",
};

const h3Style = { marginTop: 0, marginBottom: 10 };
const pStyle = { margin: "6px 0" };
const inputStyle = { display: "block", width: "100%", marginTop: 6 };
