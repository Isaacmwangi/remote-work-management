// src/pages/Resume_Page/ResumePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ResumePage.css";

const ResumePage = () => {
  const location = useLocation();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.resume) {
      fetchResume();
    }
  }, [location.state?.resume]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile/resume`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob", // The response is treated as a file blob
      });

      const fileURL = URL.createObjectURL(response.data);
      setResume(fileURL);
    } catch (err) {
      console.error("Error fetching resume", err);
      setError("Error fetching resume");
      toast.error("Failed to fetch resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resume) {
      const link = document.createElement("a");
      link.href = resume;
      link.download = "resume.pdf"; // a default filename
      link.click();
      toast.success("Resume downloaded successfully!");
    } else {
      toast.error("No resume available for download.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="resume-container">
      <h1>Resume</h1>
      {resume ? (
        <div>
          <iframe
            src={resume}
            title="Resume"
            width="100%"
            height="600px"
            style={{ border: "none" }}
          />
          <button onClick={handleDownload} className="download-button">
            Download Resume
          </button>
        </div>
      ) : (
        <p>No resume available</p>
      )}
    </div>
  );
};

export default ResumePage;
