import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddTeam.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AddTeam = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post("/api/teams", { name, description }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Team added successfully!");
      navigate("/teams");
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error("Failed to add team");
    }
  };

  return (
    <div className="add-team-container">
      <div className="add-team-form">
        <h2><i className="fas fa-plus-circle"></i> Add Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <i className="fas fa-users"></i> Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter team name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">
              <i className="fas fa-info-circle"></i> Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter team description"
            />
          </div>
          <button type="submit" className="submit-button">
            <i className="fas fa-plus-circle"></i> Add Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
