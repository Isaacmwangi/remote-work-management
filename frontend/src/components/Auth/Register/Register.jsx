import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Select Role",
    location: "",
    address: "",
    country: "",
    company: "",
    resume: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      resume: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.error || "Failed to register");
        } else {
          console.error(error.response.data || "Failed to register");
          toast.error("Server error. Please try again later.");
        }
      } else if (error.request) {
        console.error(error.request);
        toast.error("No response received from server");
      } else {
        console.error("Error during request setup:", error.message);
        toast.error("Error during registration");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="firstName">
              <b>First Name</b>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
            <i className="fas fa-user"></i>
          </div>
          <div className="input-group">
            <label htmlFor="secondName">
              <b>Second Name</b>
            </label>
            <input
              type="text"
              id="secondName"
              name="secondName"
              placeholder="Enter your second name"
              value={formData.secondName}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
            <i className="fas fa-user"></i>
          </div>
          <div className="input-group">
            <label htmlFor="username">
              <b>Username</b>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <i className="fas fa-user"></i>
          </div>
          <div className="input-group">
            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <i className="fas fa-envelope"></i>
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <b>Password</b>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <i className="fas fa-lock"></i>
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">
              <b>Confirm Password</b>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <i className="fas fa-lock"></i>
          </div>
          <div className="input-group">
            <label htmlFor="role">
              <b>Role</b>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="EMPLOYER">Employer</option>
              {/* <option value="ADMIN" disabled>Admin</option> */}
            </select>
            <i className="fas fa-user-tag"></i>
          </div>
          <div className="input-group">
            <label htmlFor="country">
              <b>Country </b>(Optional)
            </label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter your country"
              value={formData.country}
              onChange={handleChange}
              autoComplete="country"
            />
            <i className="fas fa-globe"></i>
          </div>
          <div className="input-group">
            <label htmlFor="location">
              <b>Location</b> (Optional)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter your location "
              value={formData.location}
              onChange={handleChange}
              autoComplete="address-level2"
            />
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="input-group">
            <label htmlFor="address">
              <b>Address</b>(Optional)
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address "
              value={formData.address}
              onChange={handleChange}
              autoComplete="street-address"
            />
            <i className="fas fa-address-card"></i>
          </div>
          <div className="input-group">
            <label htmlFor="company">
              <b>Company </b>(Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Enter your company or Organization name "
              value={formData.company}
              onChange={handleChange}
              autoComplete="organization"
            />
            <i className="fas fa-building"></i>
          </div>
          <div className="input-group">
            <label htmlFor="resume">
              <b>Upload Resume </b>(Optional)
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <i className="fas fa-file-upload"></i>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
