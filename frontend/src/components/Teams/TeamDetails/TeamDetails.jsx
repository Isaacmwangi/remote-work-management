import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./TeamDetails.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TeamDetails = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`/api/teams/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeam(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team", error);
        toast.error("Error fetching team details");
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  const handleEdit = () => {
    navigate(`/teams/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await axios.delete(`/api/teams/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Team deleted successfully");
        navigate("/teams");
      } catch (error) {
        console.error("Error deleting team", error);
        toast.error("Error deleting team");
      }
    }
  };

  return (
    <div className="team-details-container">
      {loading ? (
        <p>Loading...</p>
      ) : team ? (
        <div className="team-details">
          <h1><i className="fas fa-users"></i> {team.name}</h1>
          <p><i className="fas fa-info-circle"></i> {team.description}</p>
        <p><i className="fas fa-info-circle"></i><strong> Description:</strong> {team.description}</p>
        <p><strong>Employer:</strong> {team.employer ? team.employer.firstName + ' ' + team.employer.secondName : 'N/A'}</p>
        <p><strong>Employer Email:</strong> {team.employer ? team.employer.email + ' ' : 'N/A'}</p>
        <p><strong>Projects:</strong> {team.projects.length}</p>
        <p><strong>Messages:</strong> {team.messages.length}</p>
          <div className="button-group">
            <button onClick={handleEdit} className="button edit-button">
              <i className="fas fa-edit"></i> Edit
            </button>
            <button onClick={handleDelete} className="button delete-button">
              <i className="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
      ) : (
        <p>Team not found</p>
      )}
    </div>
  );
};

export default TeamDetails;
