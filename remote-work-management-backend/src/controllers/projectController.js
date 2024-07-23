const { prisma } = require('../config/db');

// Create a project
const createProject = async (req, res) => {
  const { name, description, teamId, assignedUserIds } = req.body;

  try {
    if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      return res.status(400).json({ error: 'Invalid assignedUserIds' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        team: teamId ? { connect: { id: teamId } } : undefined,
        tasks: {
          create: assignedUserIds.map(userId => ({
            assigned_to: userId,
            title: 'New Task',
            description: 'Task description',
            status: 'open',
            due_date: new Date(),
          })),
        },
        status: 'In Progress'
      },
      include: {
        team: {
          include: {
            members: true,
          },
        },
        tasks: {
          include: {
            assignedUser: true,
          },
        },
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        team: {
          include: {
            members: true,
          },
        },
        tasks: {
          include: {
            assignedUser: true,
          },
        },
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'An error occurred while fetching projects' });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        team: {
          include: {
            members: true,
          },
        },
        tasks: {
          include: {
            assignedUser: true,
          },
        },
      },
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, teamId } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        description,
        team: teamId ? { connect: { id: teamId } } : undefined,
      },
      include: {
        team: {
          include: {
            members: true,
          },
        },
        tasks: {
          include: {
            assignedUser: true,
          },
        },
      },
    });
    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'An error occurred while updating the project' });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the project exists before attempting to delete
    const projectExists = await prisma.project.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!projectExists) {
      console.warn(`Attempted to delete project with ID ${id} but it does not exist.`);
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete related tasks
    const deletedTasks = await prisma.task.deleteMany({
      where: { project_id: parseInt(id, 10) },
    });

    console.log(`Deleted ${deletedTasks.count} tasks associated with project ID ${id}.`);

    // Delete the project
    await prisma.project.delete({
      where: { id: parseInt(id, 10) },
    });

    console.log(`Successfully deleted project with ID ${id}.`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the project' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
