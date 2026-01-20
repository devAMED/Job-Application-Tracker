import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getJobById } from "../api/JobsApi";

export default function ApplyFormPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form skeleton state (not submitting yet — teammate 3 will wire API)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  async function loadJob() {
    try {
      setLoading(true);
      setError("");
      const data = await getJobById(jobId);
      setJob(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load job");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Placeholder only (teammate 3 wires applyToJobWithForm)
    alert("Form UI ready ✅ Teammate 3 will connect submission + upload.");
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2.5rem 1.25rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.1rem",
          padding: "2rem 2.2rem",
          boxShadow: "0 22px 45px rgba(15, 23, 42, 0.14)",
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <Link to={`/user/jobs/${jobId}`} style={{ textDecoration: "underline" }}>
            ← Back to Job Details
          </Link>
        </div>

        <h2 style={{ marginBottom: "0.75rem" }}>Apply</h2>

        {loading && <p>Loading job...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <p style={{ marginTop: 0, opacity: 0.85 }}>
              Applying for: <strong>{job?.title || "Job"}</strong> at{" "}
              <strong>{job?.company || "Company"}</strong>
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <label>
                  Full Name
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    style={{ display: "block", width: "100%", marginTop: 6 }}
                    required
                  />
                </label>

                <label>
                  Phone
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    style={{ display: "block", width: "100%", marginTop: 6 }}
                    required
                  />
                </label>

                <label>
                  LinkedIn (optional)
                  <input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    style={{ display: "block", width: "100%", marginTop: 6 }}
                  />
                </label>

                <label>
                  Extra Notes (optional)
                  <textarea
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    placeholder="Anything you'd like to share..."
                    style={{ display: "block", width: "100%", marginTop: 6, minHeight: 90 }}
                  />
                </label>

                <label>
                  CV Upload
                  <input
                    type="file"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    style={{ display: "block", width: "100%", marginTop: 6 }}
                    required
                  />
                  {cvFile && (
                    <div style={{ marginTop: 6, fontSize: "0.9rem", opacity: 0.8 }}>
                      Selected: {cvFile.name}
                    </div>
                  )}
                </label>
              </div>

              <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                <button type="submit">Submit application</button>
                <button type="button" onClick={() => navigate(-1)} style={{ opacity: 0.8 }}>
                  Cancel
                </button>
              </div>

              <div style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.7 }}>
                (Teammate 3 will connect this form to the API endpoint and actually upload CV.)
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
