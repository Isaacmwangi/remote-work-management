import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './AddProject.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AddProject = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [teamId, setTeamId] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No authentication token found');
			}

			await axios.post('/api/projects', { name, description, team_id: teamId }, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success('Project added successfully!');
			navigate('/projects');
		} catch (error) {
			console.error('Error adding project:', error);
			toast.error('Failed to add project');
		}
	};

	return (
		<div className="add-project-container">
			<div className="add-project-form">
				<h2>Add Project</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="name"><i className="fas fa-project-diagram"></i> Name</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="description"><i className="fas fa-info-circle"></i> Description</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="teamId"><i className="fas fa-users"></i> Team ID</label>
						<input
							type="text"
							id="teamId"
							value={teamId}
							onChange={(e) => setTeamId(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="submit-button"><i className="fas fa-plus-circle"></i> Add Project</button>
				</form>
			</div>
		</div>
	);
};

export default AddProject;
