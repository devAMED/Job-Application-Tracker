const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

/**
 * APPLY TO A JOB (User)
 * POST /api/applications/:jobId
 */
router.post("/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { notes } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      user: req.user.id,
      notes: notes || ""
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

/**
 * UPDATE APPLICATION STATUS (Admin)
 * PUT /api/applications/:id/status
 */
router.put("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "reviewed", "accepted", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
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