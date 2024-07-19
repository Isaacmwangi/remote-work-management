import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(user);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error("Error updating user profile", error);
    }
  };

  const handleResumeUpload = async (e) => {
    const formData = new FormData();
    formData.append("resume", e.target.files[0]);

    setUploading(true);

    try {
      await axios.post("/api/profile/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResumeUploaded(true);
      toast.success("Resume uploaded successfully");
      setUploading(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error uploading resume", error);
      toast.error("Error uploading resume");
      setUploading(false);
    }
  };

  const handleResumeCancel = () => {
    setUploading(false);
    setResumeUploaded(false);
  };

  const handleResumeDelete = async () => {
    try {
      await axios.delete("/api/profile/resume/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser((prevUser) => ({ ...prevUser, resume: null }));
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume", error);
      toast.error("Error deleting resume");
    }
  };

  const openResumePage = () => {
    if (user.resume) {
      navigate("/resume", { state: { resume: user.resume } });
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      {editing ? (
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
          />
          <label>Second Name:</label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName || ""}
            onChange={handleChange}
          />
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
          />
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
          />
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
          />
          <label>Role:</label>
          <select
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
          >
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer</option>
            {/* <option value="ADMIN">Admin</option> */}
          </select>
          <label>Company:</label>
          <input
            type="text"
            name="company"
            value={formData.company || ""}
            onChange={handleChange}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <div className="profile-info">
            <p><b>First Name:</b> {user.firstName}</p>
            <p><b>Second Name:</b> {user.secondName}</p>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Country:</b> {user.country}</p>
            <p><b>Location:</b> {user.location}</p>
            <p><b>Address:</b> {user.address}</p>
            <p><b>Role:</b> {user.role === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer'}</p>
            {user.company && <p><b>Company:</b> {user.company}</p>}
          </div>
          <button onClick={handleEdit} className="edit-button">
            Edit Profile
          </button>
        </div>
      )}
      <div>
        <h2>Resume</h2>
        {user.resume ? (
          <div>
            <button onClick={openResumePage} className="upload-button">
              View Resume
            </button>
            <button onClick={handleResumeDelete} className="delete-button">
              Delete Resume
            </button>
          </div>
        ) : (
          <div>
            {uploading ? (
              <div>
                <button onClick={handleResumeCancel} className="cancel-button">
                  Cancel Upload
                </button>
                <p>Uploading...</p>
              </div>
            ) : (
              <div>
                <input type="file" onChange={handleResumeUpload} />
                {resumeUploaded && (
                  <p>
                    Resume uploaded.{" "}
                    <button onClick={() => setResumeUploaded(false)}>
                      Upload Another Resume
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <h2>More Details</h2>
        <h3>My Job Posts</h3>
        <ol>
        {user.jobListings?.map((job) => (
              <li key={job.id}>
                <Link to={`/joblistings/${job.id}`}>{job.title}</Link>
              </li>
            ))}
          </ol>
        <h3>Applications</h3>
        <ol>
          {user.applications?.map((app) => (
            <li key={app.id}>{app.jobListing.title}</li>
          ))}
        </ol>
        <h3>Teams</h3>
        <ul>
          {user.teams?.map((team) => (
            <li key={team.id}>{team.name}</li>
          ))}
        </ul>
        <h3>Tasks</h3>
        <ol>
          {user.tasks?.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ol>
        <h3>Sent Messages</h3>
        <ol>
          {user.sentMessages?.map((msg) => (
            <li key={msg.id}>{msg.content}</li>
          ))}
        </ol>
        <h3>Notifications</h3>
        <ol>
          {user.notifications?.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Profile;
