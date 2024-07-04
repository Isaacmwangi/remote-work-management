
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const connection = require('../config/db').connectDB();

const User = {
  create: (newUser, callback) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';

    connection.query(query, [newUser.username, newUser.email, hashedPassword, newUser.role], (err, res) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id: res.insertId, ...newUser });
    });
  },

  // Additional methods like findByEmail, findById, etc.
};

module.exports = User;
