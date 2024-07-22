const { prisma } = require('../config/db');

const createTeam = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }


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
				messages: true,
				members: true
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
				messages: true,
				members: true
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
				messages: true,
				members: true
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
				messages: true,
				members: true
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

const addTeamMember = async (req, res) => {
	const { teamId, userId } = req.body;
	try {
		const team = await prisma.team.update({
			where: { id: parseInt(teamId) },
			data: {
				members: {
					connect: { id: parseInt(userId) },
				},
			},
			include: {
				employer: true,
				projects: true,
				messages: true,
				members: true
			}
		});
		res.json(team);
	} catch (error) {
		res.status(500).json({ error: 'Error adding team member' });
	}
};

const removeTeamMember = async (req, res) => {
	const { teamId, userId } = req.body;
	try {
		const team = await prisma.team.update({
			where: { id: parseInt(teamId) },
			data: {
				members: {
					disconnect: { id: parseInt(userId) },
				},
			},
			include: {
				employer: true,
				projects: true,
				messages: true,
				members: true
			}
		});
		res.json(team);
	} catch (error) {
		res.status(500).json({ error: 'Error removing team member' });
	}
};

module.exports = {
	createTeam,
	getTeams,
	getTeamById,
	updateTeam,
	deleteTeam,
	addTeamMember,
	removeTeamMember,
};
