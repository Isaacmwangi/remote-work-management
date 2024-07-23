import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddProject.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AddProject = () => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [teams, setTeams] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState(null);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTeamsAndUsers = async () => {
			try {
				const [teamsResponse, usersResponse] = await Promise.all([
					axios.get("/api/teams", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}),
					axios.get("/api/users", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}),
				]);
				setTeams(teamsResponse.data);
				setUsers(usersResponse.data);
				setFilteredUsers(usersResponse.data);
			} catch (error) {
				console.error('Error fetching teams or users:', error);
				toast.error("Failed to load teams or users");
			}
		};
		fetchTeamsAndUsers();
	}, []);

	useEffect(() => {
		if (searchTerm.trim() === "") {
			setFilteredUsers(users);
			setIsDropdownOpen(false);
		} else {
			const filtered = users.filter(user =>
				user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
				`${user.firstName} ${user.secondName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredUsers(filtered);
			setIsDropdownOpen(true);
		}
	}, [searchTerm, users]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No authentication token found');
			}

			const response = await axios.post("/api/projects", {
				name,
				description,
				teamId: selectedTeam ? selectedTeam.id : null,
				assignedUserIds: selectedUsers.map(user => user.id)
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success("Project added successfully!");
			navigate("/projects");
		} catch (error) {
			console.error('Error adding project:', error);
			toast.error("Failed to add project");
		}
	};

	const handleTeamChange = (teamId) => {
		const team = teams.find(t => t.id === parseInt(teamId));
		setSelectedTeam(team);
	};

	const handleUserChange = (userId) => {
		const user = users.find(u => u.id === parseInt(userId));
		if (!selectedUsers.includes(user)) {
			setSelectedUsers([...selectedUsers, user]);
		}
	};

	const handleRemoveUser = (userId) => {
		setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSelectUser = (user) => {
		handleUserChange(user.id);
		setSearchTerm('');
		setIsDropdownOpen(false);
	};

	return (
		<div className="add-project-container">
			<h2><i className="fas fa-plus-circle"></i> Add Project</h2>
			<form onSubmit={handleSubmit} className="add-project-form">
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
					<select id="team" onChange={(e) => handleTeamChange(e.target.value)}>
						<option value="">Select a team</option>
						{teams.map(team => (
							<option key={team.id} value={team.id}>
								{team.name}
							</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="users">
						<i className="fas fa-user-plus"></i> Assign Users
					</label>
					<input
						type="text"
						id="search"
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search users by name or email"
					/>
					{isDropdownOpen && (
						<ul className="user-dropdown">
							{filteredUsers.map(user => (
								<li key={user.id} onClick={() => handleSelectUser(user)}>
									{user.firstName} {user.secondName} ({user.email})
								</li>
							))}
						</ul>
					)}
					<div className="selected-users">
						{selectedUsers.map(user => (
							<div key={user.id} className="selected-user">
								{user.firstName} {user.secondName} ({user.email})
								<button type="button" onClick={() => handleRemoveUser(user.id)}>
									<i className="fas fa-times"></i>
								</button>
							</div>
						))}
					</div>
				</div>
				<button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Save Project</button>
			</form>
		</div>
	);
};

export default AddProject;
