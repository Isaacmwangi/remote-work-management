import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        job.company.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  return (
    <div className="job-search">
      <input
        type="text"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredJobs.map(job => (
          <li key={job.id}>
            <Link to={`/joblistings/${job.id}`}>{job.title} - {job.company}</Link>
          </li>
        ))}
      </ul>
      <Link to="/joblistings/add"><button>Add Job</button></Link>
    </div>
  );
};

export default JobListings;
