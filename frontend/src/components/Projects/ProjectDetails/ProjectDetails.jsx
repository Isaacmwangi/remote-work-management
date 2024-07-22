import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProjectDetails.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProjectDetails = () => {
	const { id } = useParams();
	const [project, setProject] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const response = await axios.get(`/api/projects/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setProject(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching project details', error);
				toast.error('Error fetching project details');
				setLoading(false);
			}
		};

		fetchProject();
	}, [id]);

	return (
		<div className="project-details-container">
			<h1>Project Details</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="project-details">
					<h2>{project.name}</h2>
					<p>{project.description}</p>
					<p>Team ID: {project.team_id}</p>
					<p>Created At: {new Date(project.createdAt).toLocaleDateString()}</p>
					<p>Updated At: {new Date(project.updatedAt).toLocaleDateString()}</p>
				</div>
			)}
		</div>
	);
};

export default ProjectDetails;
