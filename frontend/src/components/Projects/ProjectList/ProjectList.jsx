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

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/api/projects/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setProjects(projects.filter((project) => project.id !== id));
			toast.success('Project deleted successfully');
		} catch (error) {
			console.error('Error deleting project', error);
			toast.error('Error deleting project');
		}
	};

	return (
		<div className="project-list-container">
			<h1>Projects</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="project-list">
					{projects.map((project) => (
						<div key={project.id} className="project-item">
							<h2>{project.name}</h2>
							<p>{project.description}</p>
							<p>Team ID: {project.team_id}</p>
							<Link to={`/projects/edit/${project.id}`} className="button edit-button">
								<i className="fas fa-edit"></i> Edit
							</Link>
							<button onClick={() => handleDelete(project.id)} className="button delete-button">
								<i className="fas fa-trash"></i> Delete
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProjectList;
