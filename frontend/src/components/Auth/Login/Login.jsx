// Final_Project/frontend/src/components/Auth/Login/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5173/api/auth/login', { email, password });
      login(response.data.token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        toast.error(error.response.data.error || 'Failed to log in');
      } else if (error.request) {
        console.error(error.request);
        toast.error('No response received from server');
      } else {
        console.error('Error during request setup:', error.message);
        toast.error('Error during login');
      }
    }
  };
  
  return (
    <div className="container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
        </form>
        <div>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
