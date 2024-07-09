const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

const User = {
  // Create a new user
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
        },
      });
      return user;
    } catch (error) {
      throw new Error('Error creating user');
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
        include: { profile: true, notifications: true }, 
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error retrieving user by ID');
    }
  },

  // Find user by email
  findByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error retrieving user by email');
    }
  },

  // Update user profile
  update: async (id, updatedUser) => {
    try {
      const { username, email, role, location, address, password } = updatedUser;
      let updatedData = { username, email, role, location, address };

      // If password is provided, hash it and add to the update data
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        updatedData.password = hashedPassword;
      }

      const user = await prisma.user.update({
        where: { id: id },
        data: updatedData,
      });
      return user;
    } catch (error) {
      throw new Error('Error updating user profile');
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      await prisma.user.delete({
        where: { id: id },
      });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting user');
    }
  },

  // Find all users
  findAll: async () => {
    try {
      const users = await prisma.user.findMany({
        include: { profile: true, notifications: true }, // Include related data if needed
      });
      return users;
    } catch (error) {
      throw new Error('Error retrieving all users');
    }
  },

  // Authenticate user (for login)
  authenticate: async (email, password) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid password');
      }

      return user;
    } catch (error) {
      throw new Error('Error authenticating user');
    }
  },
};

module.exports = User;
