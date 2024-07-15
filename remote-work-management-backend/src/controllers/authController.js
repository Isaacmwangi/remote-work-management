const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const path = require('path');
const { registerSchema, loginSchema } = require('../validation/validationSchemas');

const register = async (req, res) => {
  try {
    const { username, email, password, role, country, location, address } = req.body;

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
        username,
        email,
        password: hashedPassword,
        role,
        country,
        location,
        address,
        resume: resumePath,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};



const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token'); // Clear token from cookies if using cookies
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Error logging out' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email, location, address, role, country } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user from authentication middleware

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        location,
        address,
        role,
        country,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
};
