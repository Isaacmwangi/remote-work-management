import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import AvailableJobs from "../JobListings/Available_Jobs/AvailableJobs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Dashboard = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [TeamCount, setTeamCount] = useState(0);
  const [TasksCount, setTasksCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projectsResponse, teamResponse, completedTasksResponse, jobsResponse] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/teams'),
          axios.get('/api/tasks'),
          axios.get('/api/joblistings')
        ]);

        setProjectCount(projectsResponse.data.length);
        setTeamCount(teamResponse.data.length);
        setTasksCount(completedTasksResponse.data.length);
        setJobCount(jobsResponse.data.length);
      } catch (error) {
        console.error('Error fetching counts:', error.response ? error.response.data : error.message);
        toast.error(
          <div><i className="fas fa-exclamation-triangle"></i> Failed to fetch data!</div>, 
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 5000,
          }
        );
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back to Remote Work Management</h1>
        <p>This is your dashboard to manage all your remote work needs.</p>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <i className="fas fa-project-diagram icon"></i>
          <h2>Projects</h2>
          <p>{projectCount} Ongoing</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-users icon"></i>
          <h2>Available Teams</h2>
          <p>{TeamCount} Active</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-tasks icon"></i>
          <h2> Available Tasks</h2>
          <p>{TasksCount} Tasks</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-briefcase icon"></i>
          <h2>Available Jobs</h2>
          <p>{jobCount} Jobs</p>
        </div>
      </section>

      <section className="dashboard-actions">
        <h2>Actions</h2>
        <div className="action-buttons">
          <Link to="/projects" className="action-button"><i className="fas fa-project-diagram"></i> View Projects</Link>
          <Link to="/tasks" className="action-button"><i className="fas fa-tasks"></i> View Tasks</Link>
          <Link to="/teams" className="action-button"><i className="fas fa-users"></i> View Team Members</Link>
          <Link to="/completed-tasks" className="action-button"><i className="fas fa-check-double"></i> View Completed Tasks</Link>
          <Link to="/joblistings" className="action-button"><i className="fas fa-briefcase"></i> View Available Jobs</Link>
        </div>
      </section>

      <section className="dashboard-content">
        <AvailableJobs onJobCountChange={setJobCount} />
      </section>
    </div>
  );
};

export default Dashboard;
