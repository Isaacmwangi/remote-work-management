const express = require('express');
const { getUserProfile, updateUserProfile, getAllUsers, updateUserDetails } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // to restrict access to admins

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/', authMiddleware, adminMiddleware, getAllUsers); // get all users
router.put('/details', authMiddleware, updateUserDetails);

module.exports = router;
