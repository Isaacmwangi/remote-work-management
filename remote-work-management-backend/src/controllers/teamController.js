const { prisma } = require('../config/db');

const createTeam = async (req, res) => {
  const { name, description } = req.body;
  const employerId = req.user.id;

  try {
    const team = await prisma.team.create({
      data: {
        name,
        description,
        employer_id: employerId
      },
      include: {
        employer: true,
        projects: true,
        messages: true
      }
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error creating team' });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        employer: true,
        projects: true,
        messages: true
      }
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving teams' });
  }
};

const getTeamById = async (req, res) => {
  const { id } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: {
        employer: true,
        projects: true,
        messages: true
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving team' });
  }
};

const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const team = await prisma.team.update({
      where: { id: parseInt(id) },
      data: { name, description },
      include: {
        employer: true,
        projects: true,
        messages: true
      }
    });

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error updating team' });
  }
};

const deleteTeam = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.team.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting team' });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
