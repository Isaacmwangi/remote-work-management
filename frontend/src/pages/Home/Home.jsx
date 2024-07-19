// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Remote Work Management</h1>
        <p>Efficiently manage your remote team and projects from anywhere.</p>
        <a href="/register" className="cta-button">
          Get Started
        </a>
      </header>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Team Management</h3>
            <p>Organize and manage your remote team effectively.</p>
          </div>
          <div className="feature-card">
            <h3>Project Tracking</h3>
            <p>Keep track of your projects and deadlines with ease.</p>
          </div>
          <div className="feature-card">
            <h3>Analytics</h3>
            <p>Get insights into your team's productivity and performance.</p>
          </div>
          <div className="feature-card">
            <h3>Collaboration Tools</h3>
            <p>Utilize tools that facilitate seamless team collaboration.</p>
          </div>
        </div>
      </section>
      {/* <section className="job-listings">
        <h2>Available Jobs</h2>
        <div className="job-cards">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
            </div>
          ))}
        </div>
      </section> */}

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>
              "This tool has revolutionized the way our team works remotely."
            </p>
            <p>
              <strong>- John Doe, CEO</strong>
            </p>
          </div>
          <div className="testimonial-card">
            <p>
              "A must-have for any remote team looking to boost productivity."
            </p>
            <p>
              <strong>- Jane Smith, Project Manager</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>
          Sign up today and take your remote team management to the next level.
        </p>
        <a href="/register" className="cta-button">
          Sign Up Now
        </a>
      </section>
    </div>
  );
};

export default Home;
