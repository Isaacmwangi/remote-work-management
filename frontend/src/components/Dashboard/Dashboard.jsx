import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import AvailableJobs from "../JobListings/Available_Jobs/AvailableJobs";

const Dashboard = () => {
  const [user, setUser] = useState({ username: "User" });

  useEffect(() => {
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

    fetchUser();
  }, []);

  if (!user.username) return <div>Loading...</div>;

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
          <p>10 Jobs</p> {/* Change this line to dynamically fetch job count */}
        </div>
      </section>

      <section className="dashboard-content">
        <AvailableJobs />
      </section>
    </div>
  );
};

export default Dashboard;
