const { prisma } = require('../config/db');

const createProject = async (req, res) => {
  const { team_id, name, description, status } = req.body;

  try {
    const project = await prisma.project.create({
      data: {
        team_id,
        name,
        description,
        status
      },
      include: {
        team: true,
        tasks: {
          include: {
            assignedUser: true
          }
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        team: true,
        tasks: {
          include: {
            assignedUser: true
          }
        }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving projects' });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        team: true,
        tasks: {
          include: {
            assignedUser: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving project' });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { name, description, status },
      include: {
        team: true,
        tasks: {
          include: {
            assignedUser: true
          }
        }
      }
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
