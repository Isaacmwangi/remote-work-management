// src/components/Teams/EditTeam/EditTeam.jsx

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
    members: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
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
          members: response.data.members,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team", error);
        toast.error("Error fetching team");
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAllUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
        toast.error("Error fetching users");
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
        } else {
          toast.error("You do not have permission to edit this team.");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error checking authorization", error);
        toast.error("Failed to check authorization");
        navigate("/profile");
      }
    };

    fetchTeam();
    fetchUsers();
    checkAuthorization();
  }, [id, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchTerm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/teams/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Team updated successfully");
      navigate("/teams");
    } catch (error) {
      console.error("Error updating team", error);
      toast.error("Error updating team");
    }
  };

  const handleAddMember = async () => {
    if (selectedUser) {
      try {
        const token = localStorage.getItem("token");
        await axios.post("/api/teams/add-member", {
          teamId: id,
          userId: selectedUser.id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData({
          ...formData,
          members: [...formData.members, selectedUser],
        });
        toast.success("User added to team");
        setSelectedUser(null);
      } catch (error) {
        console.error("Error adding member", error);
        toast.error("Error adding member");
      }
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/teams/remove-member", {
        teamId: id,
        userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        ...formData,
        members: formData.members.filter(member => member.id !== userId),
      });
      toast.success("User removed from team");
    } catch (error) {
      console.error("Error removing member", error);
      toast.error("Error removing member");
    }
  };

  return isAuthorized && !loading ? (
    <div className="edit-team-container">
      <h2><i className="fas fa-edit"></i> Edit Team</h2>
      <form onSubmit={handleSubmit} className="edit-team-form">
        <div className="form-group">
          <label htmlFor="name">
            <i className="fas fa-users"></i> Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter team description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="user-search">
            <i className="fas fa-search"></i> Search Users
          </label>
          <input
            type="text"
            id="user-search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by username, name, or email"
          />
          {searchTerm && (
            <ul className="user-dropdown">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <li key={user.id} onClick={() => handleSelectUser(user)}>
                    {user.firstName} {user.lastName} ({user.email})
                  </li>
                ))
              ) : (
                <li>No users found</li>
              )}
            </ul>
          )}
        </div>
        {selectedUser && (
          <div className="form-group">
            <label>
              <i className="fas fa-user-plus"></i> Selected User
            </label>
            <div className="selected-user">
              {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
              <button type="button" onClick={handleAddMember} className="add-member-button">
                <i className="fas fa-plus"></i> Add to Team
              </button>
            </div>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="members">
            <i className="fas fa-users"></i> Team Members
          </label>
          <ul className="team-members">
            {formData.members.map(member => (
              <li key={member.id}>
                {member.firstName} {member.lastName} ({member.email})
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                  className="remove-button"
                >
                  <i className="fas fa-times"></i> Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="submit-button">
          <i className="fas fa-save"></i> Save Changes
        </button>
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EditTeam;
