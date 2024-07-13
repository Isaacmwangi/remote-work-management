const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  uploadResume,
  deleteResume,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// User's own profile
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/profile/upload', authMiddleware, upload.single('resume'), uploadResume);
router.delete('/profile/resume', authMiddleware, deleteResume);

// Admin routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);

module.exports = router;
