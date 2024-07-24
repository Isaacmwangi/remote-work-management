const { prisma } = require('../config/db');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
});

const createTeam = async (req, res) => {
	const { name, description } = req.body;
	const creatorId = req.user.id;

	if (!name || !description) {
		return res.status(400).json({ error: 'Both team name and description are required.' });
	}

	try {
		// Create the team and automatically add the creator as a member
		const team = await prisma.team.create({
			data: {
				name,
				description,
				employer_id: creatorId,
				members: {
					connect: { id: creatorId }
				}
			},
			include: {
				employer: true,
				members: true,
			}
		});

		// Notify the creator
		const creatorMailOptions = {
			from: process.env.GMAIL_USER,
			to: req.user.email,
			subject: "Team Created Successfully",
			text: `Congratulations! You've successfully created the team "${team.name}".`,
		};
		transporter.sendMail(creatorMailOptions);

		// Notify the new member (creator)
		const memberMailOptions = {
			from: process.env.GMAIL_USER,
			to: req.user.email,
			subject: "Team Membership Confirmation",
			text: `You've been added as a member of the team "${team.name}".`,
		};
		transporter.sendMail(memberMailOptions);

		// Send notifications
		await prisma.notification.create({
			data: {
				user_id: creatorId,
				message: `You have successfully created and joined the team "${team.name}".`,
			}
		});

		res.status(201).json(team);
	} catch (error) {
		console.error('Error creating team:', error);
		res.status(500).json({ error: 'Failed to create the team. Please try again later.' });
	}
};

const getTeams = async (req, res) => {
	const userId = req.user.id;

	try {
		const teams = await prisma.team.findMany({
			where: {
				members: {
					some: {
						id: userId
					}
				}
			},
			include: {
				employer: true,
				projects: true,
				messages: true,
				members: true
			}
		});
		res.json(teams);
	} catch (error) {
		res.status(500).json({ error: 'Unable to retrieve teams. Please try again later.' });
	}
};

const getTeamById = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		// Fetch the team details
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
			return res.status(404).json({ error: 'Team not found.' });
		}

		// Check if the user is a member or the employer of the team
		if (team.employer_id !== userId && !team.members.some(member => member.id === userId)) {
			return res.status(403).json({ error: 'You are not authorized to view this team.' });
		}

		res.json(team);
	} catch (error) {
		res.status(500).json({ error: 'Failed to retrieve team details. Please try again later.' });
	}
};

const updateTeam = async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;
	const userId = req.user.id;

	try {
		const team = await prisma.team.update({
			where: { id: parseInt(id) },
			data: { name, description },
			include: {
				employer: true,
				members: true
			}
		});

		// Notify the team members and creator
		const mailOptions = {
			from: process.env.GMAIL_USER,
			to: team.members.map(member => member.email),
			subject: "Team Updated Successfully",
			text: `The team "${team.name}" has been updated with new details.`,
		};
		transporter.sendMail(mailOptions);

		await prisma.notification.createMany({
			data: team.members.map(member => ({
				user_id: member.id,
				message: `The team "${team.name}" you are part of has been updated.`,
			}))
		});

		res.json(team);
	} catch (error) {
		console.error('Error updating team:', error);
		res.status(500).json({ error: 'Failed to update the team. Please try again later.' });
	}
};

const deleteTeam = async (req, res) => {
	const { id } = req.params;

	try {
		const team = await prisma.team.findUnique({
			where: { id: parseInt(id) },
			include: {
				members: true
			}
		});

		if (!team) {
			return res.status(404).json({ error: 'Team not found.' });
		}

		await prisma.team.delete({
			where: { id: parseInt(id) }
		});

		// Notify members and creator about the deletion
		const mailOptions = {
			from: process.env.GMAIL_USER,
			to: team.members.map(member => member.email),
			subject: "Team Deleted",
			text: `The team "${team.name}" has been deleted.`,
		};
		transporter.sendMail(mailOptions);

		await prisma.notification.createMany({
			data: team.members.map(member => ({
				user_id: member.id,
				message: `The team "${team.name}" you were a part of has been deleted.`,
			}))
		});

		res.json({ message: 'Team deleted successfully.' });
	} catch (error) {
		console.error('Error deleting team:', error);
		res.status(500).json({ error: 'Failed to delete the team. Please try again later.' });
	}
};

const addTeamMember = async (req, res) => {
	const { teamId, userId } = req.body;

	try {
		const team = await prisma.team.update({
			where: { id: parseInt(teamId) },
			data: {
				members: {
					connect: { id: parseInt(userId) }
				}
			},
			include: {
				members: true,
				employer: true
			}
		});

		const newMember = await prisma.user.findUnique({
			where: { id: parseInt(userId) }
		});

		if (!newMember) {
			return res.status(404).json({ error: 'User not found.' });
		}

		// Notify the new member
		const newMemberMailOptions = {
			from: process.env.GMAIL_USER,
			to: newMember.email,
			subject: "Welcome to the Team",
			text: `You have been successfully added to the team "${team.name}".`,
		};
		transporter.sendMail(newMemberMailOptions);

		// Notify the team creator
		const creatorMailOptions = {
			from: process.env.GMAIL_USER,
			to: team.employer.email,
			subject: "New Team Member Added",
			text: `User ${newMember.email} has been added to the team "${team.name}".`,
		};
		transporter.sendMail(creatorMailOptions);

		// Send notifications
		await prisma.notification.createMany({
			data: [
				{
					user_id: userId,
					message: `You have been added to the team "${team.name}".`,
				},
				{
					user_id: team.employer_id,
					message: `User ${newMember.email} has been added to your team "${team.name}".`,
				}
			]
		});

		res.json(team);
	} catch (error) {
		console.error('Error adding team member:', error);
		res.status(500).json({ error: 'Failed to add team member. Please try again later.' });
	}
};

const removeTeamMember = async (req, res) => {
	const { teamId, userId } = req.body;

	try {
		const team = await prisma.team.update({
			where: { id: parseInt(teamId) },
			data: {
				members: {
					disconnect: { id: parseInt(userId) }
				}
			},
			include: {
				members: true,
				employer: true
			}
		});

		const removedMember = await prisma.user.findUnique({
			where: { id: parseInt(userId) }
		});

		if (!removedMember) {
			return res.status(404).json({ error: 'User not found.' });
		}

		// Notify the removed member
		const removedMemberMailOptions = {
			from: process.env.GMAIL_USER,
			to: removedMember.email,
			subject: "Removal from Team",
			text: `You have been removed from the team "${team.name}".`,
		};
		transporter.sendMail(removedMemberMailOptions);

		// Notify the team creator
		const creatorMailOptions = {
			from: process.env.GMAIL_USER,
			to: team.employer.email,
			subject: "Team Member Removed",
			text: `User ${removedMember.email} has been removed from the team "${team.name}".`,
		};
		transporter.sendMail(creatorMailOptions);

		// Send notifications
		await prisma.notification.createMany({
			data: [
				{
					user_id: userId,
					message: `You have been removed from the team "${team.name}".`,
				},
				{
					user_id: team.employer_id,
					message: `User ${removedMember.email} has been removed from your team "${team.name}".`,
				}
			]
		});

		res.json(team);
	} catch (error) {
		console.error('Error removing team member:', error);
		res.status(500).json({ error: 'Failed to remove team member. Please try again later.' });
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