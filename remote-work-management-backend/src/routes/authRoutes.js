const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', upload.single('resume'), validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', authMiddleware, logout); 

module.exports = router;
