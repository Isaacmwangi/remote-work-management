import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './JobListings.css';
import { toast } from 'react-toastify';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

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

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchJobs();
    fetchUserProfile();
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
        job.description.toLowerCase().includes(term.toLowerCase()) ||
        job.employer?.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const handlePostJob = () => {
    if (userRole !== 'EMPLOYER' && userRole !== 'ADMIN') {
      toast.warn('You must be an Employer or Admin to post a job. Please update your role in your profile.');
      navigate('/profile'); // Redirect to profile page for role change
    } else {
      navigate('/joblistings/add'); // Proceed to post job
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
        {/* Show "Post a Job" button if the user is an employer or admin */}
        {(userRole === 'EMPLOYER' || userRole === 'ADMIN') && (
          <button className="post-job-button" onClick={handlePostJob}>
            Post a Job
          </button>
        )}
      </div>
      <div className="job-list">
        <ol>
          {filteredJobs.map(job => (
            <li key={job.id}>
              <Link to={`/joblistings/${job.id}`} className="job-link">
                <div className="job-card">
                  <h3>{job.title}</h3>
                  <h3>{job.employer?.company}</h3>
                  <p>{job.description}</p>
                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p>
                    <strong>By:</strong> {job.employer?.username || "Unknown"}
                  </p>
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
