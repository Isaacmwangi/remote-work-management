const express = require('express');
const {
	createTeam,
	getTeams,
	getTeamById,
	updateTeam,
	deleteTeam,
	addTeamMember,
	removeTeamMember,
} = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createTeam);
router.get('/', getTeams);
router.get('/:id', getTeamById);
router.put('/:id', authMiddleware, updateTeam);
router.delete('/:id', authMiddleware, deleteTeam);
router.post('/add-member', authMiddleware, addTeamMember);
router.post('/remove-member', authMiddleware, removeTeamMember);

module.exports = router;


