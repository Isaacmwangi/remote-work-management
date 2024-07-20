const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  uploadResume,
  deleteResume,
  getResume,
  updateResume,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// User's own profile
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.post(
  "/profile/resume/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);
router.delete("/profile/resume/delete", authMiddleware, deleteResume);

// Fetch and update resume routes
router.get("/profile/resume", authMiddleware, getResume);
router.put(
  "/profile/resume/update",
  authMiddleware,
  upload.single("resume"),
  updateResume
);

// Admin routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);

module.exports = router;
