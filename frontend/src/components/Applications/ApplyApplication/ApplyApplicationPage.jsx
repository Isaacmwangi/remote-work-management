import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./ApplyApplicationPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ApplyApplicationPage = () => {
	const { jobId } = useParams();
	const [user, setUser] = useState({});
	const [formData, setFormData] = useState({
		firstName: '',
		secondName: '',
		email: '',
		resume: '',
		coverLetter: ''
	});
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [resumeUploaded, setResumeUploaded] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const response = await axios.get("/api/profile", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setUser(response.data);
			setFormData({
				firstName: response.data.firstName || '',
				secondName: response.data.secondName || '',
				email: response.data.email || '',
				resume: response.data.resume || '',
				coverLetter: '',
			});
		} catch (error) {
			console.error("Error fetching user profile", error);
			toast.error("Failed to fetch your profile. Please try again later.");
		}
	};

	const handleResumeUpload = async (e) => {
		const formData = new FormData();
		formData.append("resume", e.target.files[0]);

		setUploading(true);

		try {
			await axios.post("/api/profile/resume/upload", formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "multipart/form-data",
				},
			});
			setResumeUploaded(true);
			toast.success("Resume uploaded successfully!");
			fetchUserProfile();
		} catch (error) {
			console.error("Error uploading resume", error);
			toast.error("Failed to upload resume. Please try again.");
		} finally {
			setUploading(false);
		}
	};

	const handleResumeCancel = () => {
		setUploading(false);
		setResumeUploaded(false);
	};

	const handleResumeDelete = async () => {
		try {
			await axios.delete("/api/profile/resume/delete", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setUser(prevUser => ({ ...prevUser, resume: null }));
			toast.success("Resume deleted successfully!");
		} catch (error) {
			console.error("Error deleting resume", error);
			toast.error("Failed to delete resume. Please try again.");
		}
	};

	const openResumePage = () => {
		if (user.resume) {
			navigate("/resume", { state: { resume: user.resume } });
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await axios.post(`/api/applications/apply/${jobId}`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			toast.success("Application submitted successfully!");
			navigate("/applications");
		} catch (error) {
			console.error("Error submitting application", error);
			toast.error("Failed to submit application. Please check your details and try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="job-application-container">
			<h2>Apply for Job</h2>
			<form onSubmit={handleSubmit}>
				<label>First Name:</label>
				<input
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					required
				/>
				<label>Second Name:</label>
				<input
					type="text"
					name="secondName"
					value={formData.secondName}
					onChange={handleChange}
					required
				/>
				<label>Email:</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<label htmlFor="coverLetter">Cover Letter:</label>
				<textarea
					id="coverLetter"
					name="coverLetter"
					value={formData.coverLetter}
					onChange={handleChange}
					required
				/>
				<label>Resume:</label>
				<section className="resume-section">
					<h2>
						<i className="fas fa-file-alt"></i> Resume
					</h2>
					{user.resume ? (
						<div className="resume-actions">
							<button onClick={openResumePage} className="btn btn-success">
								<i className="fas fa-eye"></i> View Resume
							</button>
							<button onClick={handleResumeDelete} className="btn btn-danger">
								<i className="fas fa-trash"></i> Delete Resume
							</button>
						</div>
					) : (
						<div className="resume-upload">
							{uploading ? (
								<div className="upload-status">
									<button onClick={handleResumeCancel} className="btn btn-warning">
										<i className="fas fa-times"></i> Cancel Upload
									</button>
									<p>Uploading...</p>
								</div>
							) : (
								<label className="upload-label">
									<i className="fas fa-upload"></i> Upload Resume
									<input
										type="file"
										accept=".pdf,.doc,.docx"
										onChange={handleResumeUpload}
									/>
								</label>
							)}
						</div>
					)}
				</section>
				<button type="submit" disabled={loading}>
					{loading ? "Submitting..." : "Submit Application"}
				</button>
			</form>
		</div>
	);
};

export default ApplyApplicationPage;
