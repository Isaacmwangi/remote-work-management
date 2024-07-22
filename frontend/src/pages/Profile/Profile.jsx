import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile", error);
      toast.error("Error updating profile");
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
      fetchUserProfile();
    } catch (error) {
      console.error("Error uploading resume", error);
      toast.error("Error uploading resume");
    } finally {
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

  const handleJobClick = (jobId) => {
    navigate(`/joblistings/${jobId}`);
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1><i className="fas fa-user-circle"></i> My Profile</h1>
      </header>

      <section className="profile-info-section">
        {editing ? (
          <div className="profile-form">
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
            <button onClick={handleSave} className="btn btn-primary">
              <i className="fas fa-save"></i> Save
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        ) : (
          <div className="profile-info">
            <p><i className="fas fa-user"></i> <b>First Name:</b> {user.firstName}</p>
            <p><i className="fas fa-user"></i> <b>Second Name:</b> {user.secondName}</p>
            <p><i className="fas fa-user-tag"></i> <b>Username:</b> {user.username}</p>
            <p><i className="fas fa-envelope"></i> <b>Email:</b> {user.email}</p>
            <p><i className="fas fa-globe"></i> <b>Country:</b> {user.country}</p>
            <p><i className="fas fa-map-marker-alt"></i> <b>Location:</b> {user.location}</p>
            <p><i className="fas fa-home"></i> <b>Address:</b> {user.address}</p>
            <p><i className="fas fa-briefcase"></i> <b>Role:</b> {user.role}</p>
            {user.company && (
              <p><i className="fas fa-building"></i> <b>Company:</b> {user.company}</p>
            )}
            <button onClick={handleEdit} className="btn btn-primary">
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        )}
      </section>

      <section className="resume-section">
        <h2><i className="fas fa-file-alt"></i> Resume</h2>
        {user.resume ? (
          <div className="resume-actions">
            <button onClick={openResumePage} className="btn btn-success">
              <i className="fas fa-eye"></i> View Resume
            </button>
            <button onClick={handleResumeDelete} className="btn btn-danger">
              <i className="fas fa-trash"></i> Delete Resume
            </button>
          </div>
        ) : (
          <div className="resume-upload">
            {uploading ? (
              <div className="upload-status">
                <button
                  onClick={handleResumeCancel}
                  className="btn btn-warning"
                >
                  <i className="fas fa-times"></i> Cancel Upload
                </button>
                <p>Uploading...</p>
              </div>
            ) : (
              <div>
                <input type="file" onChange={handleResumeUpload} />
                {resumeUploaded && (
                  <p>
                    Resume uploaded.{" "}
                    <button
                      onClick={() => setResumeUploaded(false)}
                      className="btn btn-info"
                    >
                      <i className="fas fa-upload"></i> Upload Another Resume
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="details-section">
        <h2><i className="fas fa-info-circle"></i> More Details</h2>
        <div className="details-container">
          <div className="details-category">
            <h3><i className="fas fa-briefcase"></i> My Job Posts</h3>
            <ul>
              {user.jobListings?.map((job) => (
                <li key={job.id}>
                  <button
                    onClick={() => handleJobClick(job.id)}
                    className="btn btn-link"
                  >
                    {job.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="details-category">
            <h3><i className="fas fa-file-alt"></i> Applications</h3>
            <ul>
              {user.applications?.map((app) => (
                <li key={app.id}>{app.jobListing.title}</li>
              ))}
            </ul>
          </div>

          <div className="details-category">
            <h3><i className="fas fa-calendar-check"></i> Upcoming Interviews</h3>
            <ul>
              {user.interviews?.map((interview) => (
                <li key={interview.id}>
                  {interview.title} on {new Date(interview.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>

          <div className="details-category">
            <h3><i className="fas fa-users"></i> Teams</h3>
            <ul>
              {user.teams?.map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          </div>

          <div className="details-category">
            <h3><i className="fas fa-tasks"></i> Tasks</h3>
            <ul>
              {user.tasks?.map((task) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          </div>

          <div className="details-category">
            <h3><i className="fas fa-paper-plane"></i> Sent Messages</h3>
            <ul>
              {user.sentMessages?.map((msg) => (
                <li key={msg.id}>{msg.content}</li>
              ))}
            </ul>
          </div>

          <div className="details-category">
            <h3><i className="fas fa-inbox"></i> Received Messages</h3>
            <ul>
              {user.receivedMessages?.map((msg) => (
                <li key={msg.id}>{msg.content}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;