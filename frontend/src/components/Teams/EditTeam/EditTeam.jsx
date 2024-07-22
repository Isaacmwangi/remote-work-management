import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditTeam.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const EditTeam = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
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
        setFormData({
          name: response.data.name,
          description: response.data.description,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team", error);
        toast.error("Error fetching team");
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/teams/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Team updated successfully");
      navigate("/teams");
    } catch (error) {
      console.error("Error updating team", error);
      toast.error("Error updating team");
    }
  };

  const handleCancel = () => {
    navigate("/teams");
  };

  return (
    <div className="edit-team-container">
      <h1><i className="fas fa-edit"></i> Edit Team</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="edit-team-form">
          <label htmlFor="name">
            <i className="fas fa-users"></i> Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter team name"
          />
          <label htmlFor="description">
            <i className="fas fa-info-circle"></i> Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter team description"
          ></textarea>
          <div className="button-group">
            <button onClick={handleSave} className="button save-button">
              <i className="fas fa-save"></i> Save
            </button>
            <button onClick={handleCancel} className="button cancel-button">
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTeam;
