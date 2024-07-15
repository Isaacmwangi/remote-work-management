import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AvailableJobs.css";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);

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

    fetchJobs();
  }, []);

  const handleViewAll = () => {
    window.location.href = "/joblistings"; // Navigate to all jobs page
  };

  return (
    <div className="available-jobs">
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
              <strong>Posted by:</strong> {job.employer?.username || "Unknown"}
            </p>
            {/* Link to job details page */}
            <Link to={`/joblistings/${job.id}`} className="view-details-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
      <button onClick={handleViewAll} className="view-all-button">
        View All Jobs
      </button>
    </div>
  );
};

export default AvailableJobs;
