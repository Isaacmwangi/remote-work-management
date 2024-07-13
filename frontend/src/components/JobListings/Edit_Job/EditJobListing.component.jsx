import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditJobListing = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobListing();
  }, []);

  const fetchJobListing = async () => {
    try {
      const response = await axios.get(`/api/joblistings/${id}`);
      setJob(response.data);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setLocation(response.data.location);
    } catch (error) {
      console.error('Error fetching job listing:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/joblistings/${id}`, {
        title,
        description,
        location,
      });
      alert('Job listing updated successfully!');
    } catch (error) {
      console.error('Error updating job listing:', error);
      alert('Failed to update job listing');
    }
  };

  return (
    <div>
      <h2>Edit Job Listing</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <br />
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <br />
        <button type="submit">Update Job Listing</button>
      </form>
    </div>
  );
};

export default EditJobListing;
