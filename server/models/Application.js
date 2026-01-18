const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // -- New Fields for CV Uploads --
  fullName: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  linkedin: { 
    type: String,
    default: ""
  },
  cvUrl: { 
    type: String, 
    required: true // Path to the uploaded file
  },
  extraNotes: { 
    type: String, 
    default: "",
  },
  // -------------------------------

  status: {
    type: String,
    // Expanded status list
    enum: [
      "pending", 
      "under_review", 
      "phone_screen", 
      "technical_interview", 
      "hr_interview", 
      "offer", 
      "rejected"
    ],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Application", applicationSchema);