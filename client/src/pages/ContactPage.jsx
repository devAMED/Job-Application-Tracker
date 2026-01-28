import React from "react";

export default function ContactPage() {
  return (
    <div style={wrap}>
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Contact Us</h2>
        <p style={{ opacity: 0.85 }}>
          For questions about Applico, please contact our team:
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <div><strong>Muhammed Ahmed</strong> — Teammate 3</div>
          <div><strong>Tako Zakroshvili</strong> — Teammate 1</div>
          <div><strong>Raneem Abdelsamea</strong> — Teammate 2</div>
        </div>

        <p style={{ marginTop: 18, fontSize: 13, opacity: 0.75 }}>
          (If you want, tell me what emails you want to show here and I’ll format it nicely.)
        </p>
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
