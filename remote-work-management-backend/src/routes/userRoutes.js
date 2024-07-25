// Final_Project/remote-work-management-backend/src/routes/userRoutes.js

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
    updateAvatar,
    deleteAvatar,
    getAvatarById,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminEmployerMiddleware = require("../middleware/adminEmployerMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// User's own profile
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

// Resume routes
router.post(
    "/profile/resume/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);
router.delete("/profile/resume/delete", authMiddleware, deleteResume);
router.get("/profile/resume", authMiddleware, getResume);
router.put(
    "/profile/resume/update",
    authMiddleware,
    upload.single("resume"),
    updateResume
);

// Avatar routes
router.post(
    "/profile/avatar/update",
    authMiddleware,
    upload.single("avatar"),
    updateAvatar
);
router.delete("/profile/avatar/delete", authMiddleware, deleteAvatar);
router.get("/profile/avatar/:id", getAvatarById); // Fetch avatar by user ID

// Admin routes
router.get("/users", authMiddleware, adminEmployerMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, adminEmployerMiddleware, getUserById);

module.exports = router;
