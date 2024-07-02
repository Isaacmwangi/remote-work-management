// const connection = require('../config');
// const bcrypt = require('bcryptjs');

// const User = {
//     create: (userData, callback) => {
//         const { email, password, role } = userData;
//         bcrypt.hash(password, 10, (err, hash) => {
//             if (err) return callback(err);
//             const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
//             connection.query(sql, [email, hash, role], (error, results) => {
//                 if (error) return callback(error);
//                 callback(null, results);
//             });
//         });
//     },
//     findByEmail: (email, callback) => {
//         const sql = 'SELECT * FROM users WHERE email = ?';
//         connection.query(sql, [email], (err, results) => {
//             if (err) return callback(err);
//             callback(null, results[0]);
//         });
//     },
// };

// module.exports = User;



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
