import React from "react";

export default function AboutPage() {
  return (
    <div style={wrap}>
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>About Applico</h2>
        <p style={{ opacity: 0.85 }}>
          Applico is a Job Application Tracker that helps applicants manage their applications,
          track statuses, view interview schedules, read notes, and set reminders — while admins
          can review applicants, update statuses, schedule interviews, and access uploaded CVs securely.
        </p>

        <h3>Team</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Muhammed Ahmed</strong> — Teammate 3</li>
          <li><strong>Tako Zakroshvili</strong> — Teammate 1</li>
          <li><strong>Raneem Abdelsamea</strong> — Teammate 2</li>
        </ul>
      </div>
    </div>
  );
}

const wrap = {
  minHeight: "calc(100vh - 140px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "2.5rem 1.25rem",
};

const card = {
  width: "100%",
  maxWidth: 820,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: "2rem",
  boxShadow: "0 18px 40px rgba(15,23,42,0.10)",
};
