const { prisma } = require('../config/db');
const Joi = require('joi');

// Validation schema for creating a message
const createMessageSchema = Joi.object({
  team_id: Joi.number().integer().required(),
  sender_id: Joi.number().integer().required(),
  content: Joi.string().min(1).required(),
});

const createMessage = async (req, res) => {
  const { error } = createMessageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { team_id, sender_id, content } = req.body;

  try {
    const team = await prisma.team.findUnique({ where: { id: team_id } });
    if (!team) {
      return res.status(400).json({ message: 'Team not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: sender_id } });
    if (!user) {
      return res.status(400).json({ message: 'Sender not found' });
    }

    const message = await prisma.message.create({
      data: {
        team_id,
        sender_id,
        content
      }
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Error creating message' });
  }
};


const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
};

const getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) },
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving message' });
  }
};

const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }

  try {
    const message = await prisma.message.update({
      where: { id: parseInt(id) },
      data: { content }
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Error updating message' });
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.message.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting message' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};
