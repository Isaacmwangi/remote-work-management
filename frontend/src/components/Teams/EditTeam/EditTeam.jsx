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

    fetchTeam();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = async () => {
    if (selectedUser) {
      try {
        await axios.post("/api/teams/add-member", { teamId: id, userId: selectedUser.id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFormData({
          ...formData,
          members: [...formData.members, selectedUser],
        });
        setSelectedUser(null); // Clear selected user
        toast.success("Member added successfully");
      } catch (error) {
        console.error("Error adding member", error);
        toast.error("Error adding member");
      }
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axios.post("/api/teams/remove-member", { teamId: id, userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFormData({
        ...formData,
        members: formData.members.filter(member => member.id !== userId),
      });
      toast.success("Member removed successfully");
    } catch (error) {
      console.error("Error removing member", error);
      toast.error("Error removing member");
    }
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
          <label htmlFor="members">
            <i className="fas fa-users"></i> Team Members:
          </label>
          <div className="members-list">
            {formData.members.map(member => (
              <div key={member.id} className="member-item">
                {member.firstName} {member.lastName} ({member.email})
                <button onClick={() => handleRemoveMember(member.id)} className="remove-button">
                  <i className="fas fa-user-minus"></i> Remove
                </button>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label htmlFor="user-search">
              <i className="fas fa-search"></i> Search Users:
            </label>
            <input
              type="text"
              id="user-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username, name, or email"
            />
            <div className="user-search-results">
              {selectedUser && (
                <div className="selected-user">
                  <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <button onClick={handleAddMember} className="add-button">
                    <i className="fas fa-user-plus"></i> Add
                  </button>
                </div>
              )}
              <ul className="user-list">
                {filteredUsers
                  .filter(user => !formData.members.find(member => member.id === user.id))
                  .map(user => (
                    <li key={user.id} onClick={() => setSelectedUser(user)}>
                      {user.firstName} {user.lastName} ({user.username})
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-save" onClick={handleSave}>
              <i className="fas fa-save"></i> Save
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTeam;
