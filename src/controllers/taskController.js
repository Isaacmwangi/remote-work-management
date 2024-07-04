const { prisma } = require('../config/db');

const createTask = async (req, res) => {
  const { project_id, assigned_to, title, description, status, due_date } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        project_id,
        assigned_to,
        title,
        description,
        status,
        due_date: new Date(due_date)
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tasks' });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving task' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description, status, due_date: new Date(due_date) }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
