const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  salaryMin: {
    type: String,
    default: ""
  },
  salaryMax: {
    type: String,
    default: ""
  },
  requirements: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    default: ""
  },

  // --- New Fields for Filters ---
  locationType: { 
    type: String, 
    enum: ["remote", "onsite", "hybrid"], 
    default: "onsite" 
  },
  jobType: { 
    type: String, 
    enum: ["full_time", "part_time", "internship"], 
    default: "full_time" 
  },
  // ------------------------------

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Job", JobSchema);
