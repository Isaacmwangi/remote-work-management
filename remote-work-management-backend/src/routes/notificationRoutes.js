const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authMiddleware, getNotifications);

// Mark a notification as read
router.put('/:id/read', authMiddleware, markAsRead);

module.exports = router;
