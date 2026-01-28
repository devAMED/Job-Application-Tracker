const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    authorRole: { type: String, enum: ["user", "admin"], required: true },
    authorName: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, default: "" },

    cvUrl: { type: String, required: true }, // stored path
    extraNotes: { type: String, default: "" }, // applicant's extra notes

    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "under_review",
        "phone_screen",
        "technical_interview",
        "hr_interview",
        "offer",
        "rejected",
      ],
    },

    // Used for analytics (response rate)
    respondedAt: { type: Date, default: null },

    // Interview scheduling (admin sets)
    interviewAt: { type: Date, default: null },
    interviewLocation: { type: String, default: "" },
    interviewLink: { type: String, default: "" }, // zoom/meet link
    interviewNotes: { type: String, default: "" }, // admin notes for interview stage

    // Reminder (user sets for themselves)
    reminderAt: { type: Date, default: null },

    // Shared notes thread (admin + user can add, user can only add to own app)
    notes: { type: [noteSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
