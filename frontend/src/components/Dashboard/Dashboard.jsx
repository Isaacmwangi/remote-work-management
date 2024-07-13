import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState({ username: "User" });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/joblistings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setJobs(response.data.slice(0, 10)); // Show only top 10 jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("/api/users/profile", config);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (error.response) {
          console.error("Server Error:", error.response.data);
        } else if (error.request) {
          console.error("Request Error:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }
      }
    };

    fetchJobs();
    fetchUser();
  }, []);

  if (!user.username) return <div>Loading...</div>;

  const handleViewAll = () => {
    window.location.href = "/joblistings"; // Navigate to all jobs page
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back to Remote Work Management</h1>
        <p>This is Your dashboard to manage all your remote work needs.</p>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <h2>Projects</h2>
          <p>7 Ongoing</p>
        </div>
        <div className="stat-card">
          <h2>Team Members</h2>
          <p> 5 Active</p>
        </div>
        <div className="stat-card">
          <h2>Tasks Completed</h2>
          <p>5 Tasks</p>
        </div>
        <div className="stat-card">
          <h2>Available Jobs</h2>
          <p>{jobs.length} Jobs</p>
        </div>
      </section>

      <section className="dashboard-content">
        <h2>Available Jobs</h2>
        <div className="job-cards">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              {/* Display job details */}
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Posted by:</strong>{" "}
                {job.employer?.username || "Unknown"}
              </p>
              {/* Link to job details page */}
              <Link to={`/joblistings/${job.id}`}>View Details</Link>
            </div>
          ))}
        </div>
        <button onClick={handleViewAll}>View All Jobs</button>
      </section>
    </div>
  );
};

export default Dashboard;
