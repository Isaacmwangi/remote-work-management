import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AvailableJobs.css";

const AvailableJobs = ({ onJobCountChange }) => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/joblistings");
        setJobs(response.data);
        setFilteredJobs(response.data.slice(0, 6)); // Initially show top 6 jobs
        onJobCountChange(response.data.length); // Update job count in parent component
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserRole(response.data.role); // Set user role
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchJobs();
    fetchUserRole();
  }, [onJobCountChange]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterJobs(e.target.value);
  };

  const filterJobs = (term) => {
    if (term.trim() === "") {
      setFilteredJobs(jobs.slice(0, 6)); // Show top 6 jobs when search is cleared
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(term.toLowerCase()) ||
          job.description.toLowerCase().includes(term.toLowerCase()) ||
          job.employer?.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const handleViewAll = () => {
    window.location.href = "/joblistings"; // Navigate to all jobs page
  };

  return (
    <div className="available-jobs">
      <h2>Available Jobs</h2>
      <div className="search-and-post">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        {/* Show "Post a Job" button if the user is an employer or admin */}
        {(userRole === "EMPLOYER" || userRole === "ADMIN") && (
          <Link to="/joblistings/add" className="post-job-button">
            Post a Job
          </Link>
        )}
      </div>
      <div className="job-cards">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            {/* Display job details */}
            <h3>{job.title}</h3>
            <h3>{job.company}</h3>
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

      {jobs.length > 6 && (
        <button onClick={handleViewAll} className="view-all-button">
          View All Jobs
        </button>
      )}
    </div>
  );
};

export default AvailableJobs;
