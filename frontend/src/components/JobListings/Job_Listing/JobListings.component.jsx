import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './JobListings.css';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/joblistings');
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterJobs(e.target.value);
  };

  const filterJobs = (term) => {
    if (term.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(term.toLowerCase()) ||
        job.employer.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  return (
    <div className="job-listings-container">
      <div className="job-search-section">
        <div className="job-search">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={handleSearch}
            className="job-search-input"
          />
          </div>
          <Link to="/joblistings/add">
            <button className="post-job-button">Post a Job</button>
          </Link>
      </div>
      <div className="job-list">
        <ol>
          {filteredJobs.map(job => (
            <li key={job.id}>
              <Link to={`/joblistings/${job.id}`} className="job-link">
                <div className="job-card">
                  <h3>{job.title}</h3>
                  <h3>Company:{job.company}</h3>
            <p>{job.description}</p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>By:</strong>{" "}
              {job.employer?.username || "Unknown"}
            </p>
            {/* Link to job details page */}
            <Link
              to={`/joblistings/${job.id}`}
              className="view-details-link"
            >
              View Details
            </Link>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default JobListings;
