// src/components/Teams/AddTeam/AddTeam.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddTeam.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AddTeam = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAllUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error("Failed to load users");
      }
    };

    const checkAuthorization = async () => {
      try {
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const role = response.data.role;
        if (role === 'EMPLOYER' || role === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          toast.error("You do not have permission to add a team.");
          navigate("/profile");
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        toast.error("Failed to check authorization");
        navigate("/profile");
      }
    };

    fetchUsers();
    checkAuthorization();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(allUsers);
      setIsDropdownOpen(false);
    } else {
      const filtered = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsDropdownOpen(true);
    }
  }, [searchTerm, allUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await axios.post("/api/teams", { name, description }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const teamId = response.data.id;
      
      await axios.post("/api/teams/add-member", { teamId, userId: response.data.employer_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success("Team created successfully");
      navigate("/teams"); 
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error("Failed to create team");
    }
  };
  

  const handleMemberChange = (userId) => {
    if (!selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(id => id !== userId));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectUser = (user) => {
    handleMemberChange(user.id);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  return isAuthorized ? (
    <div className="add-team-container">
      <h2><i className="fas fa-plus-circle"></i> Add Team</h2>
      <form onSubmit={handleSubmit} className="add-team-form">
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
          {isDropdownOpen && (
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
        <div className="form-group">
          <label htmlFor="members">
            <i className="fas fa-user-plus"></i> Selected Members
          </label>
          <ul className="selected-members">
            {selectedMembers.map(userId => {
              const user = allUsers.find(u => u.id === userId);
              return user ? (
                <li key={user.id} className="selected-member">
                  {user.firstName} {user.lastName} ({user.email})
                  <button type="button" onClick={() => handleRemoveMember(user.id)} className="remove-button">
                    <i className="fas fa-times"></i> Remove
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        </div>
        <button type="submit" className="submit-button">
          <i className="fas fa-plus-circle"></i> Add Team
        </button>
      </form>
    </div>
  ) : null;
};

export default AddTeam;
