// authUtils.js
import axios from 'axios';

const auth = axios.create({
  baseURL: 'https://remoteworkmanagement.onrender.com/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default auth;
