// client/src/components/JobForm.jsx
import React, { useEffect, useState } from "react";

const emptyJob = {
  title: "",
  company: "",
  location: "",
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
    <form onSubmit={handleSubmit}>
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
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <button type="submit">{initialJob ? "Update Job" : "Create Job"}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default JobForm;
