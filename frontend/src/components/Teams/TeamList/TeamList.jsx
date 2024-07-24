// src/components/Teams/TeamList/TeamList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./TeamList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/api/teams", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to load teams");
      }
    };

    const checkAuthorization = async () => {
      try {
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const role = response.data.role;
        if (role === "EMPLOYER" || role === "ADMIN") {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        toast.error("Failed to check authorization");
      }
    };

    fetchTeams();
    checkAuthorization();
  }, []);

  return (
    <div className="team-list-container">
      <h1><i className="fas fa-users"></i> Team List</h1>
      {isAuthorized && (
        <Link to="/teams/add" className="add-team-button">
          <i className="fas fa-plus-circle"></i> Add Team
        </Link>
      )}
      <ul className="team-list">
        {teams.length > 0 ? (
          teams.map((team) => (
            <li key={team.id} className="team-item">
              <h3>
                <i className="fas fa-users"></i> {team.name}
              </h3>
              <p>{team.description}</p>
              <Link to={`/teams/${team.id}`} className="view-details-button">
                <i className="fas fa-eye"></i> View Details
              </Link>
            </li>
          ))
        ) : (
          <p>No teams available</p>
        )}
      </ul>
    </div>
  );
};

export default TeamList;
