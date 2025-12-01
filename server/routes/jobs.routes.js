const express = require("express");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

/**
 * CREATE JOB (Admin Only)
 * POST /api/jobs
 */
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = await Job.create({
      title,
      company,
      location,
      description
    });

    return res.status(201).json({ message: "Job created", job: newJob });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET ALL JOBS (Public)
 * GET /api/jobs
 */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE JOB (Admin Only)
 * PUT /api/jobs/:id
 */
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json({ message: "Job updated", job: updatedJob });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE JOB (Admin Only)
 * DELETE /api/jobs/:id
 */
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;