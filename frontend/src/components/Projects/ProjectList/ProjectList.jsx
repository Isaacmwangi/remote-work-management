import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProjectList.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects', error);
        toast.error('Error fetching projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="project-list-container">
      <h1>Project List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="project-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Team</th>
              <th>Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>
                  {project.team ? project.team.name : 'No team assigned'}
                </td>
                <td>{project.tasks.length}</td>
                <td>
                  <Link to={`/projects/${project.id}`} className="view-button">
                    <i className="fas fa-eye"></i> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectList;
