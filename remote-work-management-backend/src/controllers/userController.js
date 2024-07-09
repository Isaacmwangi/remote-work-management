const { prisma } = require('../config/db');
const User = require('../models/User');

const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email, location, address, password } = req.body;

  const updatedUser = { username, email, location, address, password };

  try {
    await User.update(userId, updatedUser, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user profile' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    await User.findAll((err, users) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(users);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

// Update user details (for admin use)
const updateUserDetails = async (req, res) => {
  const userId = req.body.id; // Admin provides the user ID to update
  const updatedUser = req.body;

  try {
    await User.update(userId, updatedUser, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user details' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserDetails,
};
