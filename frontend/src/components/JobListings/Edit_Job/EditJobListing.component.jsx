import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditJobListing.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const EditJobListing = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobListing = async () => {
      try {
        const response = await axios.get(`/api/joblistings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJob(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          requirements: response.data.requirements,
          location: response.data.location,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job listing", error);
        toast.error("Error fetching job listing");
        setLoading(false);
      }
    };

    fetchJobListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/joblistings/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Job listing updated successfully");
      navigate("/joblistings");
    } catch (error) {
      console.error("Error updating job listing", error);
      toast.error("Error updating job listing");
    }
  };

  const handleCancel = () => {
    navigate("/joblistings");
  };

  return (
    <div className="edit-job-listing-container">
      <h1>Edit</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="edit-job-listing-form">
          <label htmlFor="title">
            <i className="fas fa-heading"></i> Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <label htmlFor="description">
            <i className="fas fa-align-left"></i> Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="requirements">
            <i className="fas fa-list"></i> Requirements:
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="location">
            <i className="fas fa-map-marker-alt"></i> Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <div className="button-group">
            <button onClick={handleSave} className="button save-button">
              <i className="fas fa-save"></i> Save
            </button>
            <button onClick={handleCancel} className="button cancel-button">
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditJobListing;
