import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./TeamList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TeamList = () => {
  const [teams, setTeams] = useState([]);

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
        toast.error("Error fetching teams.");
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="team-list-container">
      <h2><i className="fas fa-users"></i> Teams</h2>
      <Link to="/teams/add" className="btn btn-primary">
        <i className="fas fa-plus-circle"></i> Add Team
      </Link>
      <ul className="team-list">
        {teams.map((team) => (
          <li key={team.id}>
            <Link to={`/teams/${team.id}`} className="team-item">
              <h3>{team.name}</h3>
              <p>{team.description}</p>
              <p><strong>Projects:</strong> {team.projects.length}</p>
              <p><strong>Messages:</strong> {team.messages.length}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;
