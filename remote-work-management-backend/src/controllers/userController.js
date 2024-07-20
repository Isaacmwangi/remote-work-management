const { prisma } = require("../config/db");
const path = require("path");
const fs = require("fs");

// Retrieve user profile
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
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving user profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    secondName,
    username,
    email,
    location,
    address,
    role,
    country,
    company,
  } = req.body;

  let updatedUser = {
    firstName,
    secondName,
    username,
    email,
    location,
    address,
    role,
    country,
    company,
  };

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

// Get all users
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
    res.status(500).json({ error: "Error retrieving users" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID provided" });
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
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Error retrieving user" });
  }
};

// Upload user resume
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

// Delete user resume
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

    if (user.resume) {
      fs.unlinkSync(path.resolve(user.resume));
    }

    res.json({ message: "Resume deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting resume" });
  }
};

// Fetch user resume
const getResume = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { resume: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumePath = path.resolve(
      __dirname,
      "..",
      "uploads",
      path.basename(user.resume)
    );

    if (!fs.existsSync(resumePath)) {
      console.error("Resume file does not exist:", resumePath);
      return res.status(404).json({ message: "Resume file not found" });
    }

    res.sendFile(resumePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving resume" });
  }
};

// Update user resume
const updateResume = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const resumePath = path.join(__dirname, "..", "uploads", req.file.filename);

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { resume: resumePath },
      select: { resume: true },
    });

    res.json({ message: "Resume updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating resume" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  uploadResume,
  deleteResume,
  getResume,
  updateResume,
};
