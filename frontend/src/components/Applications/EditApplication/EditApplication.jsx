// src/components/Applications/EditApplication/EditApplications.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditApplications = () => {
	const { id } = useParams();
	const [formData, setFormData] = useState({
		status: '',
	});
	const navigate = useNavigate();

	useEffect(() => {
		const fetchApplication = async () => {
			try {
				const response = await axios.get(`/api/applications/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setFormData({
					status: response.data.status,
				});
			} catch (error) {
				console.error('Error fetching application details', error);
				toast.error('Error fetching application details');
			}
		};
		fetchApplication();
	}, [id]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/api/applications/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			toast.success('Application updated successfully');
			navigate(`/applications/details/${id}`);
		} catch (error) {
			console.error('Error updating application', error);
			toast.error('Error updating application');
		}
	};

	return (
		<div className="edit-application">
			<h2>Edit Application</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Status</label>
					<input
						type="text"
						name="status"
						value={formData.status}
						onChange={handleChange}
					/>
				</div>
				<button type="submit">Update Application</button>
			</form>
		</div>
	);
};

export default EditApplications;
