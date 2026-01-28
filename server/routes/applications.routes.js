const express = require("express");
const path = require("path");
const fs = require("fs");

const Application = require("../models/Application");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");
const upload = require("../config/upload");

const router = express.Router();

/** Helpers */
function normalizeLinkedIn(value) {
  const l = String(value || "").trim();
  if (!l) return "";
  if (l.startsWith("http://") || l.startsWith("https://")) return l;
  return `https://${l}`;
}

async function populateForAdmin(appId) {
  return Application.findById(appId)
    .populate("job")
    .populate("user", "name email role");
}

async function populateForUser(appId) {
  return Application.findById(appId).populate("job");
}

/**
 * APPLY TO A JOB (User)
 * POST /api/applications/:jobId
 * multipart/form-data: fullName, phone, linkedin, extraNotes, cv(file)
 */
router.post("/:jobId", authMiddleware, upload.single("cv"), async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    const { fullName, phone, linkedin, extraNotes } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({ job: jobId, user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    // Store a WEB-SAFE URL
    const cvUrl = `/uploads/cv/${req.file.filename}`;

    const application = await Application.create({
      job: jobId,
      user: req.user.id,
      fullName: String(fullName || "").trim(),
      phone: String(phone || "").trim(),
      linkedin: normalizeLinkedIn(linkedin),
      cvUrl,
      extraNotes: String(extraNotes || ""),
      status: "pending",
    });

    const populated = await populateForUser(application._id);

    return res.status(201).json({ message: "Application submitted", application: populated });
  } catch (error) {
    console.error("POST /api/applications/:jobId error:", error);
    return res.status(500).json({ message: "Failed to submit application" });
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
    console.error("GET /api/applications/my error:", error);
    return res.status(500).json({ message: "Failed to load my applications" });
  }
});

/**
 * GET MY APPLICATIONS SUMMARY (User)
 * GET /api/applications/my/summary
 */
router.get("/my/summary", authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).select("job status").lean();

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
 * ANALYTICS (User)
 * GET /api/applications/my/analytics
 */
router.get("/my/analytics", authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).select("status createdAt respondedAt");

    const total = apps.length;
    const responded = apps.filter((a) => !!a.respondedAt).length;
    const responseRate = total === 0 ? 0 : Math.round((responded / total) * 100);

    const respondedApps = apps.filter((a) => a.respondedAt && a.createdAt);
    const avgResponseTimeDays = respondedApps.length
      ? respondedApps.reduce((sum, a) => {
          const ms = new Date(a.respondedAt).getTime() - new Date(a.createdAt).getTime();
          return sum + ms / (1000 * 60 * 60 * 24);
        }, 0) / respondedApps.length
      : 0;

    const byStatus = apps.reduce((acc, a) => {
      const key = a.status || "pending";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      total,
      responded,
      responseRate,
      avgResponseTimeDays: Math.round(avgResponseTimeDays * 10) / 10,
      byStatus,
    });
  } catch (err) {
    console.error("GET /api/applications/my/analytics error:", err);
    return res.status(500).json({ message: "Failed to build analytics" });
  }
});

/**
 * UPDATE MY APPLICATION (User) - must own it
 * PUT /api/applications/my/:id
 * multipart/form-data: fullName, phone, linkedin, extraNotes, cv(optional)
 */
router.put("/my/:id", authMiddleware, upload.single("cv"), async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.user) !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    // Lock edits after final statuses
    const lockStatuses = ["offer", "rejected"];
    if (lockStatuses.includes(String(app.status || "").toLowerCase())) {
      return res.status(400).json({ message: "You cannot edit an application after it is finalized." });
    }

    const { fullName, phone, linkedin, extraNotes } = req.body;

    // Validation: don’t allow blank required fields
    if (fullName !== undefined && !String(fullName).trim()) {
      return res.status(400).json({ message: "Full name cannot be empty" });
    }
    if (phone !== undefined && !String(phone).trim()) {
      return res.status(400).json({ message: "Phone cannot be empty" });
    }

    if (fullName !== undefined) app.fullName = String(fullName).trim();
    if (phone !== undefined) app.phone = String(phone).trim();
    if (linkedin !== undefined) app.linkedin = normalizeLinkedIn(linkedin);
    if (extraNotes !== undefined) app.extraNotes = String(extraNotes || "");

    // Optional CV replacement
    if (req.file) {
      app.cvUrl = `/uploads/cv/${req.file.filename}`;
    }

    await app.save();

    const populated = await populateForUser(app._id);
    return res.json({ message: "Application updated", application: populated });
  } catch (err) {
    console.error("PUT /api/applications/my/:id error:", err);
    return res.status(500).json({ message: "Failed to update application" });
  }
});

/**
 * GET ONE APPLICATION (User) - must own it
 * GET /api/applications/my/:id
 */
router.get("/my/:id", authMiddleware, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("job");
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.user) !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    return res.json({ application: app });
  } catch (err) {
    console.error("GET /api/applications/my/:id error:", err);
    return res.status(500).json({ message: "Failed to load application" });
  }
});

/**
 * USER TRACKING (User) - must own it
 * PUT /api/applications/:id/tracking
 */
router.put("/:id/tracking", authMiddleware, async (req, res) => {
  try {
    const { reminderAt, extraNotes } = req.body;

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.user) !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    if (reminderAt !== undefined) app.reminderAt = reminderAt ? new Date(reminderAt) : null;
    if (extraNotes !== undefined) app.extraNotes = String(extraNotes || "");

    await app.save();
    return res.json({ message: "Tracking updated", application: app });
  } catch (err) {
    console.error("PUT /api/applications/:id/tracking error:", err);
    return res.status(500).json({ message: "Failed to update tracking" });
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
    console.error("GET /api/applications error:", error);
    return res.status(500).json({ message: "Failed to load all applications" });
  }
});

/**
 * ADMIN-ONLY: VIEW/DOWNLOAD CV
 * GET /api/applications/:id/cv
 */
router.get("/:id/cv", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findById(id).select("cvUrl");
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (!app.cvUrl) return res.status(404).json({ message: "No CV uploaded" });

    const raw = String(app.cvUrl).replace(/\\/g, "/");
    const rel = raw.startsWith("/") ? raw.slice(1) : raw; // "uploads/cv/..."

    // routes folder -> server root
    const serverRoot = path.join(__dirname, ".."); // server/
    const absPath = path.join(serverRoot, rel);    // server/uploads/cv/...

    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ message: "CV file not found on server", absPath });
    }

    return res.sendFile(absPath);
  } catch (err) {
    console.error("GET /api/applications/:id/cv error:", err);
    return res.status(500).json({ message: "Failed to fetch CV" });
  }
});

/**
 * GET ONE APPLICATION (Admin)
 * GET /api/applications/:id
 */
router.get("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const app = await populateForAdmin(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    return res.json({ application: app });
  } catch (err) {
    console.error("GET /api/applications/:id error:", err);
    return res.status(500).json({ message: "Failed to load application" });
  }
});

/**
 * ADD NOTE (User) - must own the app
 * POST /api/applications/:id/notes
 */
router.post("/:id/notes", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.user) !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    app.notes.push({
      text: String(text).trim(),
      authorRole: "user",
      authorName: "",
    });

    await app.save();
    return res.json({ message: "Note added", application: app });
  } catch (err) {
    console.error("POST /api/applications/:id/notes error:", err);
    return res.status(500).json({ message: "Failed to add note" });
  }
});

/**
 * ADD NOTE (Admin)
 * POST /api/applications/:id/admin/notes
 */
router.post("/:id/admin/notes", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.notes.push({
      text: String(text).trim(),
      authorRole: "admin",
      authorName: req.user?.name || "",
    });

    if (!app.respondedAt) app.respondedAt = new Date();

    await app.save();

    // IMPORTANT: return populated so Admin details page doesn't break
    const populated = await populateForAdmin(app._id);
    return res.json({ message: "Admin note added", application: populated });
  } catch (err) {
    console.error("POST /api/applications/:id/admin/notes error:", err);
    return res.status(500).json({ message: "Failed to add admin note" });
  }
});

/**
 * SET REMINDER (User)
 * PUT /api/applications/:id/reminder
 */
router.put("/:id/reminder", authMiddleware, async (req, res) => {
  try {
    const { reminderAt } = req.body;

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.user) !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    app.reminderAt = reminderAt ? new Date(reminderAt) : null;
    await app.save();

    return res.json({ message: "Reminder updated", application: app });
  } catch (err) {
    console.error("PUT /api/applications/:id/reminder error:", err);
    return res.status(500).json({ message: "Failed to set reminder" });
  }
});

/**
 * UPDATE STATUS (Admin)
 * PUT /api/applications/:id/status
 */
router.put("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      "pending",
      "under_review",
      "phone_screen",
      "technical_interview",
      "hr_interview",
      "offer",
      "rejected",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const shouldSetRespondedAt = !app.respondedAt && app.status === "pending" && status !== "pending";

    app.status = status;
    if (shouldSetRespondedAt) app.respondedAt = new Date();

    await app.save();

    const populated = await populateForAdmin(app._id);
    return res.json({ message: "Status updated", application: populated });
  } catch (err) {
    console.error("PUT /api/applications/:id/status error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
});

/**
 * SCHEDULE / UPDATE INTERVIEW (Admin)
 * PUT /api/applications/:id/interview
 */
router.put("/:id/interview", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { interviewAt, interviewLocation, interviewLink, interviewNotes } = req.body;

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (interviewAt !== undefined) app.interviewAt = interviewAt ? new Date(interviewAt) : null;
    if (interviewLocation !== undefined) app.interviewLocation = String(interviewLocation || "");
    if (interviewLink !== undefined) app.interviewLink = String(interviewLink || "");
    if (interviewNotes !== undefined) app.interviewNotes = String(interviewNotes || "");

    if (!app.respondedAt) app.respondedAt = new Date();

    await app.save();

    // IMPORTANT: return populated so Admin details page doesn't break
    const populated = await populateForAdmin(app._id);
    return res.json({ message: "Interview updated", application: populated });
  } catch (err) {
    console.error("PUT /api/applications/:id/interview error:", err);
    return res.status(500).json({ message: "Failed to update interview" });
  }
});

module.exports = router;
