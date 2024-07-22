// Final_Project/frontend/src/components/Tasks/TaskDetails/TaskDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './TaskDetails.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TaskDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [task, setTask] = useState(null);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		fetchTask();
		fetchCurrentUser();
	}, [id]);

	const fetchTask = async () => {
		try {
			const response = await axios.get(`/api/tasks/${id}`);
			setTask(response.data);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching task', error);
			toast.error('Error fetching task');
			setLoading(false);
		}
	};

	const fetchCurrentUser = async () => {
		try {
			const response = await axios.get('/api/profile', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setCurrentUser(response.data);
		} catch (error) {
			console.error('Error fetching user profile', error);
			toast.error('Error fetching user profile');
		}
	};

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this task?')) {
			try {
				await axios.delete(`/api/tasks/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				toast.success('Task deleted successfully');
				navigate('/tasks');
			} catch (error) {
				console.error('Error deleting task', error);
				toast.error('Error deleting task');
			}
		}
	};

	const handleEdit = () => {
		navigate(`/tasks/edit/${id}`);
	};

	if (loading) {
		return <div className="loading">Loading...</div>;
	}

	if (!task) {
		return <div className="not-found">Task not found</div>;
	}

	return (
		<div className="task-details">
			<h1 className="task-title">{task.title}</h1>
			<h3 className="task-project">Project: {task.project.name}</h3>
			<p className="task-description">Description: {task.description}</p>
			<p className="task-status">
				<i className="fas fa-tasks"></i> <strong>Status:</strong> {task.status}
			</p>
			<p className="task-due-date">
				<i className="fas fa-calendar-alt"></i> <strong>Due Date:</strong> {new Date(task.due_date).toLocaleDateString()}
			</p>
			<p className="task-assigned-to">
				<i className="fas fa-user"></i> <strong>Assigned To:</strong> {task.assignedUser.firstName} {task.assignedUser.secondName} ({task.assignedUser.email})
			</p>
			{currentUser &&
				(currentUser.id === task.assigned_to || currentUser.role === 'ADMIN') && (
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

export default TaskDetails;
