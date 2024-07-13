import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddJobListing.module.css';

const AddJobListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

      await axios.post('/api/joblistings', {
        title,
        description,
        location,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Job listing added successfully!');
    } catch (error) {
      console.error('Error adding job listing:', error);
      alert('Failed to add job listing');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Job Listing</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Add Job Listing</button>
      </form>
    </div>
  );
};

export default AddJobListing;
