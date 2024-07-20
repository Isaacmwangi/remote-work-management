import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./JobListingDetails.css";

const JobListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobListing, setJobListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchJobListing();
    fetchCurrentUser();
  }, [id]);

  const fetchJobListing = async () => {
    try {
      const response = await axios.get(`/api/joblistings/${id}`);
      setJobListing(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job listing", error);
      toast.error("Error fetching job listing");
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile", error);
      toast.error("Error fetching user profile");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        await axios.delete(`/api/joblistings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Job listing deleted successfully");
        navigate("/joblistings");
      } catch (error) {
        console.error("Error deleting job listing", error);
        toast.error("Error deleting job listing");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-job/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!jobListing) {
    return <div className="not-found">Job listing not found</div>;
  }

  return (
    <div className="job-listing-details">
      <h1 className="job-title">{jobListing.title}</h1>
      <p className="job-description">{jobListing.description}</p>
      <p className="job-requirements">
        <strong>Requirements:</strong> {jobListing.requirements}
      </p>
      <p className="job-location">
        <strong>Location:</strong> {jobListing.location}
      </p>
      <p className="job-posted-by">
        <strong>Posted by:</strong> {jobListing.employer.username}
      </p>
      <h3>{jobListing.employer.company}</h3>

      {currentUser &&
        (currentUser.id === jobListing.employer.id ||
          currentUser.role === "ADMIN") && (
          <div className="actions">
            <button onClick={handleEdit} className="btn btn-primary">
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        )}
    </div>
  );
};

export default JobListingDetails;
