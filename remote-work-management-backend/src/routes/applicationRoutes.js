// src/routes/applicationRoutes.js
const express = require("express");
const {
    applyForJob,
    getApplications,
    getApplicationsByJob,
    getApplicationById,
    updateApplicationsByJob,
    deleteApplication,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/apply/:jobId", authMiddleware, applyForJob);
router.get("/", authMiddleware, getApplications);
router.get("/:jobId", authMiddleware, getApplicationsByJob);
router.get("/details/:id", authMiddleware, getApplicationById);
router.put("/:id", authMiddleware, updateApplicationsByJob);
router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router;
