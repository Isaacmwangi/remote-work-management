const { prisma } = require('../config/db');

const getUserProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.user;
  const { resume, skills, experience } = req.body;

  try {
    const profile = await prisma.profile.upsert({
      where: { user_id: userId },
      update: { resume, skills, experience },
      create: { user_id: userId, resume, skills, experience },
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user profile' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
