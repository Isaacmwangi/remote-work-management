import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./TeamList.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TeamList = () => {
	const [teams, setTeams] = useState([]);
	const navigate = useNavigate(); // Use navigate here

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const response = await axios.get("/api/teams", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setTeams(response.data);
			} catch (error) {
				toast.error("Error fetching teams.");
			}
		};

		fetchTeams();
	}, []);

	const handleBack = () => {
		navigate("/");
	};

	return (
		<div className="team-list-container">
			<h2><i className="fas fa-users"></i> Teams</h2>
			<Link to="/teams/add" className="btn btn-primary">
				<i className="fas fa-plus-circle"></i> Add Team
			</Link>
			<ul className="team-list">
				{teams.length > 0 ? (
					teams.map((team) => (
						<li key={team.id}>
							<Link to={`/teams/${team.id}`} className="team-item">
								<h3>Name: {team.name}</h3>
								<p>Description: {team.description}</p>
								<p><strong>Projects:</strong> {team.projects.length}</p>
								<p><strong>Messages:</strong> {team.messages.length}</p>
								<p><strong>Members:</strong></p>
								<ul>
									{team.members.map((member) => (
										<li key={member.id}>
											{member.firstName} {member.secondName}
										</li>
									))}
								</ul>
							</Link>
						</li> // Closing <li> tag
					))
				) : (
					<p>No teams available.</p>
				)}
			</ul>
			<div className="button-group">
				<button onClick={handleBack} className="button back-button">
					<i className="fas fa-arrow-left"></i> Back
				</button>
			</div>
		</div>
	);
};

export default TeamList;
