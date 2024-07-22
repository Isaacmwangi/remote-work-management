import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EditProject.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EditProject = () => {
	const { id } = useParams();
	const [project, setProject] = useState({});
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		teamId: ''
	});
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const response = await axios.get(`/api/projects/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setProject(response.data);
				setFormData({
					name: response.data.name,
					description: response.data.description,
					teamId: response.data.team_id,
				});
				setLoading(false);
			} catch (error) {
				console.error('Error fetching project', error);
				toast.error('Error fetching project');
				setLoading(false);
			}
		};

		fetchProject();
	}, [id]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = async () => {
		try {
			await axios.put(`/api/projects/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			toast.success('Project updated successfully');
			navigate('/projects');
		} catch (error) {
			console.error('Error updating project', error);
			toast.error('Error updating project');
		}
	};

	const handleCancel = () => {
		navigate('/projects');
	};

	return (
		<div className="edit-project-container">
			<h1>Edit Project</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="edit-project-form">
					<label htmlFor="name"><i className="fas fa-project-diagram"></i> Name:</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
					<label htmlFor="description"><i className="fas fa-info-circle"></i> Description:</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
					></textarea>
					<label htmlFor="teamId"><i className="fas fa-users"></i> Team ID:</label>
					<input
						type="text"
						id="teamId"
						name="teamId"
						value={formData.teamId}
						onChange={handleChange}
					/>
					<div className="button-group">
						<button onClick={handleSave} className="button save-button"><i className="fas fa-save"></i> Save</button>
						<button onClick={handleCancel} className="button cancel-button"><i className="fas fa-times"></i> Cancel</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditProject;
