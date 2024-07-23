import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./ProjectDetails.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ProjectDetails = () => {
	const { id } = useParams();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProjectDetails = async () => {
			try {
				const response = await axios.get(`/api/projects/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setProject(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching project details:", error);
				toast.error("Failed to load project details");
				setLoading(false);
			}
		};

		fetchProjectDetails();
	}, [id]);

	const handleDeleteProject = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			await axios.delete(`/api/projects/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success("Project deleted successfully!");
			navigate("/projects");
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed to delete project");
		}
	};

	if (loading) {
		return <div className="loading">Loading...</div>;
	}

	if (!project) {
		return <div className="not-found">Project not found</div>;
	}

	return (
		<div className="project-details-container">
			<button onClick={() => navigate(-1)} className="back-button">
				<i className="fas fa-arrow-left"></i> Back
			</button>
			<h2 className="title"><i className="fas fa-project-diagram"></i> Project Details</h2>
			<div className="project-details">
				<div className="detail">
					<h3><i className="fas fa-info-circle"></i> Name</h3>
					<p>{project.name}</p>
				</div>
				<div className="detail">
					<h3><i className="fas fa-align-left"></i> Description</h3>
					<p>{project.description}</p>
				</div>
				<div className="detail">
					<h3><i className="fas fa-users"></i> Team</h3>
					<p>{project.team ? project.team.name : "No team assigned"}</p>
					{project.team && project.team.members && (
						<ul>
							{project.team.members.map((member) => (
								<li key={member.id}>{member.firstName} {member.secondName} ({member.email})</li>
							))}
						</ul>
					)}
				</div>
				<div className="detail">
					<h3><i className="fas fa-tasks"></i> Tasks</h3>
					{project.tasks && project.tasks.length > 0 ? (
						<ul>
							{project.tasks.map((task) => (
								<li key={task.id}>
									<strong>{task.title}</strong>: {task.description} (Assigned to: {task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.secondName} (${task.assignedUser.email})` : "Unassigned"})
								</li>
							))}
						</ul>
					) : (
						<p>No tasks assigned</p>
					)}
				</div>
				<div className="actions">
					<button onClick={() => navigate(`/projects/edit/${project.id}`)} className="btn btn-warning">
						<i className="fas fa-edit"></i> Edit
					</button>
					<button onClick={handleDeleteProject} className="btn btn-danger">
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProjectDetails;
