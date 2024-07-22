// Final_Project/frontend/src/components/Tasks/TaskList/TaskList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './TaskList.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TaskList = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await axios.get('/api/tasks', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setTasks(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching tasks', error);
				toast.error('Error fetching tasks');
				setLoading(false);
			}
		};

		fetchTasks();
	}, []);

	return (
		<div className="task-list-container">
			<h1>Task List</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<table className="task-list-table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Project</th>
							<th>Assigned To</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{tasks.map((task) => (
							<tr key={task.id}>
								<td>{task.title}</td>
								<td>{task.project.name}</td>
								<td>{task.assignedUser.firstName} {task.assignedUser.lastName}</td>
								<td>{task.status}</td>
								<td>
									<Link to={`/tasks/${task.id}`} className="view-button">
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

export default TaskList;
