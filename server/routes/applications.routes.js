const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");
const upload = require("../config/upload"); // Import the new upload config

const router = express.Router();

/**
 * APPLY TO A JOB (User)
 * POST /api/applications/:jobId
 * Expects: multipart/form-data with fields: fullName, phone, linkedin, extraNotes, cv (file)
 */
router.post("/:jobId", authMiddleware, upload.single("cv"), async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // 1. Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    // 2. Extract text fields from body (FormData converts them to strings)
    const { fullName, phone, linkedin, extraNotes } = req.body;

    // 3. Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 4. Create path for the database
    // req.file.path gives the full system path. We usually want a relative path for the DB.
    // Example: "uploads/cv/1709...resume.pdf"
    const cvPath = req.file.path; 

    // 5. Create application
    const application = await Application.create({
      job: jobId,
      user: req.user.id,
      fullName,
      phone,
      linkedin,
      cvUrl: cvPath,
      extraNotes: extraNotes || "",
      status: "pending" // Default status
    });

    return res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET MY APPLICATIONS (User)
 * GET /api/applications/my
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate("job")
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET ALL APPLICATIONS (Admin)
 * GET /api/applications
 */
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "name email")
      .populate("job")
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/my/summary", authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id })
      .select("job status")      // only return job + status
      .lean();

    const summary = apps.map((a) => ({
      jobId: a.job.toString(),
      status: a.status,
    }));

    return res.json(summary);
  } catch (err) {
    console.error("GET /api/applications/my/summary error:", err);
    return res.status(500).json({ message: "Failed to load applications summary" });
  }
});


/**
 * UPDATE APPLICATION STATUS (Admin)
 * PUT /api/applications/:id/status
 */
router.put("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = [
      "pending", 
      "under_review", 
      "phone_screen", 
      "technical_interview", 
      "hr_interview", 
      "offer", 
      "rejected"
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("job");

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json({ message: "Status updated", application: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;