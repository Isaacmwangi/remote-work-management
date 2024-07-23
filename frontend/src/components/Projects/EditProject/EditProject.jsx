import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./EditProject.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const EditProject = () => {
	const { id } = useParams();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [teamId, setTeamId] = useState(null);
	const [assignedUserIds, setAssignedUserIds] = useState([]);
	const [allTeams, setAllTeams] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProjectDetails = async () => {
			try {
				const response = await axios.get(`/api/projects/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				const project = response.data;
				setName(project.name);
				setDescription(project.description);
				setTeamId(project.team ? project.team.id : null);
				setAssignedUserIds(project.tasks.map((task) => task.assigned_to));
			} catch (error) {
				console.error("Error fetching project details:", error);
				toast.error("Failed to load project details");
			}
		};

		const fetchTeamsAndUsers = async () => {
			try {
				const [teamsResponse, usersResponse] = await Promise.all([
					axios.get("/api/teams", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
					axios.get("/api/users", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}),
				]);
				setAllTeams(teamsResponse.data);
				setAllUsers(usersResponse.data);
				setFilteredUsers(usersResponse.data);
			} catch (error) {
				console.error("Error fetching teams or users:", error);
				toast.error("Failed to load teams or users");
			}
		};

		fetchProjectDetails();
		fetchTeamsAndUsers();
	}, [id]);

	useEffect(() => {
		if (searchTerm.trim() === "") {
			setFilteredUsers(allUsers);
			setIsDropdownOpen(false);
		} else {
			const filtered = allUsers.filter(
				(user) =>
					user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
					`${user.firstName} ${user.lastName}`
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredUsers(filtered);
			setIsDropdownOpen(true);
		}
	}, [searchTerm, allUsers]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			await axios.put(
				`/api/projects/${id}`,
				{ name, description, teamId, assignedUserIds },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			toast.success("Project updated successfully!");
			navigate("/projects");
		} catch (error) {
			console.error("Error updating project:", error);
			toast.error("Failed to update project");
		}
	};

	const handleUserSelection = (userId) => {
		if (!assignedUserIds.includes(userId)) {
			setAssignedUserIds([...assignedUserIds, userId]);
		}
	};

	const handleRemoveUser = (userId) => {
		setAssignedUserIds(assignedUserIds.filter((id) => id !== userId));
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSelectUser = (user) => {
		handleUserSelection(user.id);
		setSearchTerm("");
		setIsDropdownOpen(false);
	};

	return (
		<div className="edit-project-container">
			<h2>
				<i className="fas fa-edit"></i> Edit Project
			</h2>
			<form onSubmit={handleSubmit} className="edit-project-form">
				<div className="form-group">
					<label htmlFor="name">
						<i className="fas fa-project-diagram"></i> Name
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						placeholder="Enter project name"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="description">
						<i className="fas fa-info-circle"></i> Description
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						placeholder="Enter project description"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="team">
						<i className="fas fa-users"></i> Team
					</label>
					<select
						id="team"
						value={teamId || ""}
						onChange={(e) => setTeamId(e.target.value)}
					>
						<option value="">Select a team</option>
						{allTeams.map((team) => (
							<option key={team.id} value={team.id}>
								{team.name}
							</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="user-search">
						<i className="fas fa-search"></i> Assign Users
					</label>
					<input
						type="text"
						id="user-search"
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search by username, name, or email"
					/>
					{isDropdownOpen && (
						<ul className="user-dropdown">
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<li key={user.id} onClick={() => handleSelectUser(user)}>
										{user.firstName} {user.lastName} ({user.email})
									</li>
								))
							) : (
								<li>No users found</li>
							)}
						</ul>
					)}
				</div>
				<div className="form-group">
					<label htmlFor="assigned-users">
						<i className="fas fa-user-plus"></i> Assigned Users
					</label>
					<ul className="assigned-users">
						{assignedUserIds.map((userId) => {
							const user = allUsers.find((u) => u.id === userId);
							return user ? (
								<li key={user.id} className="assigned-user">
									{user.firstName} {user.lastName} ({user.email})
									<button
										type="button"
										onClick={() => handleRemoveUser(user.id)}
										className="remove-button"
									>
										<i className="fas fa-times"></i> Remove
									</button>
								</li>
							) : null;
						})}
					</ul>
				</div>
				<button type="submit" className="submit-button">
					<i className="fas fa-save"></i> Update Project
				</button>
			</form>
		</div>
	);
};

export default EditProject;
