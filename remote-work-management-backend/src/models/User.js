const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

const User = {
  create: async (newUser) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    try {
      const user = await prisma.user.create({
        data: {
          username: newUser.username,
          email: newUser.email,
          password: hashedPassword,
          role: newUser.role,
          location: newUser.location,
          address: newUser.address,
          resume: newUser.resume,
          tasks: newUser.tasks,
          completedTasks: newUser.completedTasks,
        },
      });
      return user;
    } catch (error) {
      throw new Error('Error creating user');
    }
  },

  findById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { profile: true, notifications: true, tasks: true, completedTasks: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error retrieving user');
    }
  },

  findByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true, notifications: true, tasks: true, completedTasks: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error retrieving user');
    }
  },

  update: async (id, updates) => {
    try {
      if (updates.password) {
        const salt = bcrypt.genSaltSync(10);
        updates.password = bcrypt.hashSync(updates.password, salt);
      }
      const user = await prisma.user.update({
        where: { id },
        data: updates,
        include: { profile: true, notifications: true, tasks: true, completedTasks: true },
      });
      return user;
    } catch (error) {
      throw new Error('Error updating user');
    }
  },

  delete: async (id) => {
    try {
      const user = await prisma.user.delete({
        where: { id },
        include: { profile: true, notifications: true, tasks: true, completedTasks: true },
      });
      return user;
    } catch (error) {
      throw new Error('Error deleting user');
    }
  },

  authenticate: async (email, password) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }
      return user;
    } catch (error) {
      throw new Error('Error authenticating user');
    }
  },
};

module.exports = User;
