const express = require('express');
const {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require('../controllers/communicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createMessage);
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.put('/:id', authMiddleware, updateMessage);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
