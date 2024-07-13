const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', authMiddleware, logout); 

module.exports = router;
