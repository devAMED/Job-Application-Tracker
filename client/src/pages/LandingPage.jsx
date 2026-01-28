import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// put your logo file in: client/src/assets/applico-logo.png
import logo from "../assets/applico-logo.png";

export default function LandingPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={wrap}>
      <div
        style={{
          ...card,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0px)" : "translateY(10px)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={logo}
            alt="Applico logo"
            style={{ width: 110, height: 110, objectFit: "contain" }}
          />
          <h1 style={{ margin: "0.6rem 0 0.25rem" }}>Applico</h1>
          <p style={{ marginTop: 0, opacity: 0.8 }}>
            A Job Application Tracker built by our team — apply, track status,
            get interview updates, notes, and reminders.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
          <Link to="/register" style={primaryBtn}>Register</Link>
          <Link to="/login" style={ghostBtn}>Login</Link>
        </div>

        <div style={{ marginTop: 18, textAlign: "center", display: "flex", gap: 14, justifyContent: "center" }}>
          <Link to="/about" style={link}>About</Link>
          <Link to="/contact" style={link}>Contact</Link>
        </div>
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
  padding: "2.3rem 2rem",
  boxShadow: "0 18px 40px rgba(15,23,42,0.10)",
  transition: "all 480ms ease",
};

const primaryBtn = {
  padding: "10px 16px",
  borderRadius: 14,
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
};

const ghostBtn = {
  padding: "10px 16px",
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111827",
  textDecoration: "none",
};

const link = { textDecoration: "underline", color: "#111827", opacity: 0.8 };
