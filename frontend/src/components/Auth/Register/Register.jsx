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
  const [role, setRole] = useState("JOB_SEEKER"); // Default to JOB_SEEKER
  const [resume, setResume] = useState(null); // State to hold resume file
  const [country, setCountry] = useState(""); // Optional field
  const [location, setLocation] = useState(""); // Optional field
  const [company, setCompany] = useState(""); // Optional field for employers
  const [isPrivateEntity, setIsPrivateEntity] = useState(false); // New state for private entities

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (resume) {
        formData.append("resume", resume);
      }
      if (country) {
        formData.append("country", country);
      }
      if (location) {
        formData.append("location", location);
      }
      if (role === "EMPLOYER") {
        formData.append("company", company);
        formData.append("isPrivateEntity", isPrivateEntity);
      }

      await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        toast.error(error.response.data.error || "Failed to register");
      } else if (error.request) {
        console.error(error.request);
        toast.error("No response received from server");
      } else {
        console.error("Error during request setup:", error.message);
        toast.error("Error during registration");
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
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer</option>
          </select>
          {role === "EMPLOYER" && (
            <>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company or Organization"
              />
              <label>
                <input
                  type="checkbox"
                  checked={isPrivateEntity}
                  onChange={(e) => setIsPrivateEntity(e.target.checked)}
                />
                Private Entity
              </label>
            </>
          )}
          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            accept=".pdf,.doc,.docx"
          />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

