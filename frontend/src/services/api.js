import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const register = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default {
  register,
  login
};
