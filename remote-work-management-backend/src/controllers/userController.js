// userController.js

const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');
const path = require('path');

const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: true,
        jobListings: true,
        applications: true,
        teams: true,
        tasks: true,
        sentMessages: true,
        notifications: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user profile' });
  }
};


const updateUserProfile = async (req, res) => {
	const userId = req.user.id;
	const { username, email, location, address, role, country } = req.body;

	let updatedUser = { username, email, location, address, role, country };

	try {
		const user = await prisma.user.update({
			where: { id: userId },
			data: updatedUser,
			include: {
				profiles: true,
				jobListings: true,
				applications: true,
				teams: true,
				tasks: true,
				sentMessages: true,
				notifications: true,
			},
		});
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error updating user profile" });
	}
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profiles: true,
        jobListings: true,
        applications: true,
        teams: true,
        tasks: true,
        sentMessages: true,
        notifications: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID provided' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: true,
        jobListings: true,
        applications: true,
        teams: true,
        tasks: true,
        sentMessages: true,
        notifications: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Error retrieving user' });
  }
};


const uploadResume = async (req, res) => {
	const userId = req.user.id;

	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const resumePath = path.join("uploads", req.file.filename);

	try {
		const user = await prisma.user.update({
			where: { id: userId },
			data: { resume: resumePath },
			include: {
				profiles: true,
				jobListings: true,
				applications: true,
				teams: true,
				tasks: true,
				sentMessages: true,
				notifications: true,
			},
		});
		res.json({ message: "Resume uploaded successfully", user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error uploading resume" });
	}
};

const deleteResume = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { resume: null },
      include: {
        profiles: true,
        jobListings: true,
        applications: true,
        teams: true,
        tasks: true,
        sentMessages: true,
        notifications: true,
      },
    });
    res.json({ message: "Resume deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting resume" });
  }
};


module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  uploadResume,
  deleteResume,
};