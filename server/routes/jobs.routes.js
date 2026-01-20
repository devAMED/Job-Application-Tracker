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
    const { sort, locationType, jobType } = req.query;

    // Build filter object
    const filter = {};
    if (locationType && locationType !== "all") filter.locationType = locationType;
    if (jobType && jobType !== "all") filter.jobType = jobType;

    // Build sort option
    let sortOption = { createdAt: -1 }; // default newest first
    if (sort === "createdAt_asc") sortOption = { createdAt: 1 };
    if (sort === "createdAt_desc") sortOption = { createdAt: -1 };

    const jobs = await Job.find(filter).sort(sortOption);
    return res.json(jobs);
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json(job);
  } catch (err) {
    console.error("GET /api/jobs/:id error:", err);

    // If invalid Mongo ID format
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid job id" });
    }

    return res.status(500).json({ message: "Failed to load job details" });
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