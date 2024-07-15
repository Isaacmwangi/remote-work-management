import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import AvailableJobs from "../JobListings/Available_Jobs/AvailableJobs";

const Dashboard = () => {
  const [jobCount, setJobCount] = useState(0);

  const handleJobCountChange = (count) => {
    setJobCount(count);
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
          <p>5 Active</p>
        </div>
        <div className="stat-card">
          <h2>Tasks Completed</h2>
          <p>5 Tasks</p>
        </div>
        <div className="stat-card">
          <h2>Available Jobs</h2>
          <p>{jobCount} Jobs</p>
        </div>
      </section>

      <section className="dashboard-content">
        <AvailableJobs onJobCountChange={handleJobCountChange} />
      </section>
    </div>
  );
};

export default Dashboard;
