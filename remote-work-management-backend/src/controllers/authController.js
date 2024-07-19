// Final_Project/remote-work-management-backend/src/controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const { prisma } = require('../config/db');
const { registerSchema, loginSchema } = require('../validation/validationSchemas');

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, secondName, username, email, password, role, country, location, address, company } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let resumePath = null;
    if (req.file) {
      resumePath = path.join("uploads", req.file.filename);
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        secondName,
        username,
        email,
        password: hashedPassword,
        role, // Storing role as provided in the request
        country,
        location,
        address,
        company,
        resume: resumePath, // Optional resume upload
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Error logging out' });
  }
};

module.exports = {
  register,
  login,
  logout
};
