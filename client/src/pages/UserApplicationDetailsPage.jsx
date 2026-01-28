import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addNoteToApplication,
  getMyApplicationById,
  setReminder,
  updateMyApplicationWithForm,
} from "../api/applicationsApi";

export default function UserApplicationDetailsPage() {
  const { id } = useParams();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Reminder + notes
  const [noteText, setNoteText] = useState("");
  const [reminderAt, setReminderAt] = useState("");

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields (draft)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [cvFile, setCvFile] = useState(null);

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

      // seed edit drafts
      setFullName(data.fullName || "");
      setPhone(data.phone || "");
      setLinkedin(data.linkedin || "");
      setExtraNotes(data.extraNotes || "");
      setCvFile(null);
    } catch (e) {
      setError(e.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdits() {
    try {
      setSaving(true);
      setError("");

      const fd = new FormData();
      fd.append("fullName", fullName);
      fd.append("phone", phone);
      fd.append("linkedin", linkedin);
      fd.append("extraNotes", extraNotes);
      if (cvFile) fd.append("cv", cvFile);

      const updated = await updateMyApplicationWithForm(id, fd);
      setApp(updated);

      setIsEditing(false);
      setCvFile(null);
    } catch (e) {
      setError(e.message || "Failed to update application");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdits() {
    if (!app) return;
    setFullName(app.fullName || "");
    setPhone(app.phone || "");
    setLinkedin(app.linkedin || "");
    setExtraNotes(app.extraNotes || "");
    setCvFile(null);
    setIsEditing(false);
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
      const updated = await setReminder(
        id,
        reminderAt ? new Date(reminderAt).toISOString() : null
      );
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

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ marginTop: 0 }}>My Application</h2>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit application</button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSaveEdits} disabled={saving}>
              Save changes
            </button>
            <button onClick={handleCancelEdits} style={{ opacity: 0.8 }} disabled={saving}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Status */}
      <section style={cardStyle}>
        <h3 style={h3Style}>Status</h3>
        <p style={{ margin: 0 }}>
          Current status: <strong>{app.status}</strong>
        </p>
        <p style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>
          Applied at: {new Date(app.createdAt).toLocaleString()}
        </p>
      </section>

      {/* Edit block */}
      <section style={cardStyle}>
        <h3 style={h3Style}>Application Details</h3>

        {!isEditing ? (
          <>
            <p style={pStyle}><strong>Full name:</strong> {app.fullName}</p>
            <p style={pStyle}><strong>Phone:</strong> {app.phone}</p>
            <p style={pStyle}>
              <strong>LinkedIn:</strong>{" "}
              {app.linkedin ? (
                <a
                  href={app.linkedin.startsWith("http") ? app.linkedin : `https://${app.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {app.linkedin}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p style={pStyle}><strong>Extra notes:</strong> {app.extraNotes || "—"}</p>

            <p style={pStyle}>
              <strong>CV:</strong>{" "}
              {app.cvUrl ? (
                <span style={{ opacity: 0.8 }}>Uploaded</span>
              ) : (
                "—"
              )}
            </p>
          </>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <label>
              Full name
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label>
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label>
              LinkedIn
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/..."
                style={inputStyle}
              />
            </label>

            <label>
              Extra notes
              <textarea
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                style={{ ...inputStyle, minHeight: 90 }}
              />
            </label>

            <label>
              Replace CV (optional)
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                style={inputStyle}
              />
              {cvFile && (
                <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                  Selected: {cvFile.name}
                </div>
              )}
            </label>
          </div>
        )}
      </section>

      {/* Interview Info */}
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

      {/* Reminder */}
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

      {/* Notes */}
      <section style={cardStyle}>
        <h3 style={h3Style}>Notes</h3>

        {app.notes?.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            {app.notes.map((n, idx) => (
              <div
                key={idx}
                style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}
              >
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
