import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("JOB_SEEKER"); // Default to JOB_SEEKER or EMPLOYER
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        role,
      });
      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error(error.response.data); // Log the detailed error response from backend
        toast.error(error.response.data.error || 'Failed to register');
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
        toast.error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error during request setup:', error.message);
        toast.error('Error during registration');
      }
    }
  };

  return (
    <div className="container">
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
          />
          {/* Role selection */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer</option>
          </select>

          <button type="submit">Register</button>
        </form>
        <div>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
