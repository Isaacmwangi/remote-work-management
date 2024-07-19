// Final_Project/remote-work-management-backend/src/routes/authRoutes.js
const express = require('express');
const multer = require('multer');
const { register, login, logout } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import upload middleware

const router = express.Router();
router.post('/register', upload.single('resume'), validateRegister, register); // Handle resume upload on registration
router.post('/login', validateLogin, login);
router.post('/logout', logout);

module.exports = router;
