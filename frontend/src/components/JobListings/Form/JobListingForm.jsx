import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";

const JobListingForm = ({ initialData }) => {
  const history = useHistory();
  const [formData, setFormData] = useState(
    initialData || {
      company: "",
      organization: "",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await api.put(`/joblistings/${initialData.id}`, formData);
      } else {
        await api.post("/joblistings", formData);
      }
      history.push("/joblistings");
    } catch (error) {
      console.error("Error submitting job listing:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <label>Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <label>Location:</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <label>Company:</label>
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
      />
      <label>Organization:</label>
      <input
        type="text"
        name="organization"
        value={formData.organization}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default JobListingForm;
