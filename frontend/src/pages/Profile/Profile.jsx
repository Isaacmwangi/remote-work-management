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
    country: "",
    resume: null,
    jobListings: [],
    applications: [],
    teams: [],
    tasks: [],
    sentMessages: [],
    notifications: [],
    company: "",
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
        toast.error("Failed to fetch profile");
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
      formData.append("country", profile.country);
      formData.append("company", profile.company);
      formData.append("isPrivateEntity", profile.isPrivateEntity);

      if (profile.resume) {
        formData.append("resume", profile.resume);
      }

      const response = await axios.put("/api/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);

        fetchProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const viewResume = () => {
    if (profile.resume instanceof File) {
      const url = URL.createObjectURL(profile.resume);
      window.open(url, "_blank");
    } else if (profile.resume) {
      window.open(profile.resume, "_blank");
    } else {
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
          <label>Country:</label>
          {isEditing ? (
            <input
              type="text"
              name="country"
              value={profile.country}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.country}</span>
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
        <div className="profile-field">
          <label>Company/Organization:</label>
          {isEditing ? (
            <input
              type="text"
              name="company"
              value={profile.company}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.company}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Employment Type:</label>
          <span>
            {profile.isPrivateEntity ? "Own Business" : profile.company}
          </span>
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
            <label>Upload Resume:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="profile-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleEditToggle}>Cancel</button>
        </div>
      ) : (
        <button onClick={handleEditToggle}>Edit Profile</button>
      )}

      <div className="related-entities">
        <h2>More Details</h2>
        <div>
          <h3>My Job Posts</h3>
          <ol>
            {profile.jobListings.map((job) => (
              <li key={job.id}>{job.title}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Applications</h3>
          <ol>
            {profile.applications.map((application) => (
              <li key={application.id}>{application.title}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Teams</h3>
          <ol>
            {profile.teams.map((team) => (
              <li key={team.id}>{team.name}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Tasks</h3>
          <ol>
            {profile.tasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Sent Messages</h3>
          <ol>
            {profile.sentMessages.map((message) => (
              <li key={message.id}>{message.content}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Notifications</h3>
          <ol>
            {profile.notifications.map((notification) => (
              <li key={notification.id}>{notification.message}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Profile;
