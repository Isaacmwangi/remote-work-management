import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './JobListingDetails.module.css';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobListing = async () => {
      try {
        const response = await axios.get(`/api/joblistings/${id}`);
        setJob(response.data);
        if (response.data.employer_id) {
          fetchUserDetails(response.data.employer_id); 
        }
      } catch (error) {
        console.error('Error fetching job listing:', error);
      }
    };

    fetchJobListing();
  }, [id]); 

  const fetchUserDetails = async (employerId) => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get(`/api/users/${employerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        await axios.delete(`/api/joblistings/${id}`);
        alert('Job listing deleted successfully');
        navigate('/joblistings');
      } catch (error) {
        console.error('Error deleting job listing:', error);
        alert('Failed to delete job listing');
      }
    }
  };

  const handleApply = async () => {
    // application logic 
    alert('Application functionality to be implemented');
  };

  return (
    <div className={styles.container}>
      <h2>Job Details</h2>
      <h3>Title: {job.title}</h3>
      <p>Description: {job.description}</p>
      <p>Location: {job.location}</p>
      <p><strong>Posted by:</strong> {job.employer?.username || 'Unknown'}</p>
      <p><strong>Contact Email:</strong> {user.email || 'Email not available'}</p>
      {/* Display apply button */}
      <button onClick={handleApply}>Apply for Job</button>
      {/* Display delete button if the user is the owner */}
      {job.isOwner && (
        <button onClick={handleDelete}>Delete Job Listing</button>
      )}
    </div>
  );
};

export default JobDetails;
