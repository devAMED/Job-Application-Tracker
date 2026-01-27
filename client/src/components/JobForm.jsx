// client/src/components/JobForm.jsx
import React, { useEffect, useState } from "react";

const emptyJob = {
  title: "",
  company: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  requirements: "",
  about: "",
  description: "",
};

function JobForm({ onSubmit, initialJob, onCancel }) {
  const [form, setForm] = useState(emptyJob);

  useEffect(() => {
    if (initialJob) setForm(initialJob);
    else setForm(emptyJob);
  }, [initialJob]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.8rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.8rem" }}>
        <input
          name="title"
          placeholder="Job title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.8rem" }}>
        <input
          name="salaryMin"
          placeholder="Min salary (e.g. 60000)"
          value={form.salaryMin || ""}
          onChange={handleChange}
        />
        <input
          name="salaryMax"
          placeholder="Max salary (e.g. 90000)"
          value={form.salaryMax || ""}
          onChange={handleChange}
        />
      </div>

      <textarea
        name="about"
        placeholder="About the job (share team, mission, what makes it special)"
        value={form.about || ""}
        onChange={handleChange}
        rows={3}
      />

      <textarea
        name="requirements"
        placeholder="Key requirements (separate with new lines)"
        value={form.requirements || ""}
        onChange={handleChange}
        rows={3}
      />

      <textarea
        name="description"
        placeholder="Public job description"
        value={form.description}
        onChange={handleChange}
        rows={4}
      />

      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button type="submit">
          {initialJob ? "Update Job" : "Create Job"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ opacity: 0.7 }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default JobForm;
