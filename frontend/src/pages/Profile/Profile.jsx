import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    location: "",
    address: "",
    role: "",
    resume: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile((prevProfile) => ({
      ...prevProfile,
      resume: file,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("email", profile.email);
      formData.append("location", profile.location);
      formData.append("address", profile.address);
      formData.append("role", profile.role);
      if (profile.resume) {
        formData.append("resume", profile.resume);
      }

      await axios.put("/api/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteResume = async () => {
    try {
      await axios.delete("/api/profile/resume", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Resume deleted successfully");
      setProfile((prevProfile) => ({
        ...prevProfile,
        resume: null,
      }));
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  const viewResume = () => {
    // Check if profile.resume is a File object
    if (profile.resume instanceof File) {
      // Create a URL for the file object
      const url = URL.createObjectURL(profile.resume);
      // Open the URL in a new tab
      window.open(url, '_blank');
    } else if (profile.resume) {
      // Handle case where resume is a path or URL
      window.open(profile.resume, '_blank');
    } else {
      // Handle case where resume is not available
      console.error("Resume file not found or invalid");
      toast.error("Resume file not found or invalid");
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-info">
        <div className="profile-field">
          <label>Username:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.username}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.email}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Location:</label>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.location}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Address:</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.address}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Role:</label>
          {isEditing ? (
            <select name="role" value={profile.role} onChange={handleChange}>
              <option value="EMPLOYER">Employer</option>
              <option value="JOB_SEEKER">Job Seeker</option>
            </select>
          ) : (
            <span>{profile.role}</span>
          )}
        </div>
        {profile.resume && (
          <div className="profile-field">
            <label>Resume:</label>
            <div>
              <button onClick={viewResume}>View Resume</button>
              {isEditing && (
                <button onClick={handleDeleteResume}>Delete Resume</button>
              )}
            </div>
          </div>
        )}
        {isEditing && (
          <div className="profile-field">
            <label>Upload New Resume:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      <div className="profile-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleEditToggle}>Cancel</button>
          </>
        ) : (
          <button onClick={handleEditToggle}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
