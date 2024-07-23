import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ApplicationsDetails.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const ApplicationsDetails = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`/api/applications/details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log('Application Details:', response.data); // Log the response
                setApplication(response.data);
                setStatus(response.data.status);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching application details', error);
                toast.error('Failed to fetch application details');
                navigate('/applications');
            }
        };
        fetchApplicationDetails();
    }, [id, navigate]);

    const handleStatusChange = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/applications/${id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Application status updated successfully');
            setIsEditing(false); 
        } catch (error) {
            console.error('Error updating application status', error);
            toast.error('Failed to update application status');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await axios.delete(`/api/applications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('Application deleted successfully');
                navigate('/applications');
            } catch (error) {
                console.error('Error deleting application', error);
                toast.error('Failed to delete application');
            }
        }
    };

    const handleResumeClick = () => {
        navigate('/resume', { state: { resume: application.resume } });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!application) {
        return <p>No application found</p>;
    }

    const jobListing = application.jobListing || {};  // Ensure jobListing is handled correctly
    const jobSeeker = application.jobSeeker || {};

    return (
        <div className="application-details">
            <h2>Application Details</h2>
            <div className="details-section">
                <p><strong>Applied On:</strong> {new Date(application.applied_on).toLocaleDateString()}</p>
            </div>

            <div className="details-section">
                <h3>Applicant Details</h3>
                <p><strong>Name:</strong> {jobSeeker.firstName} {jobSeeker.lastName}</p>
                <p><strong>Email:</strong> {jobSeeker.email}</p>
                <p><strong>Resume:</strong> <button onClick={handleResumeClick}>View Resume</button></p>
                <p><strong>Location:</strong> {jobSeeker.location || 'N/A'}</p>
                <p><strong>Address:</strong> {jobSeeker.address || 'N/A'}</p>
                <p><strong>Company:</strong> {jobSeeker.company || 'N/A'}</p>
            </div>

            <div className="details-section">
                <h3>Application Status</h3>
                {isEditing ? (
                    <form onSubmit={handleStatusChange}>
                        <label>
                            Status:
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </label>
                        <button type="submit">Update Status</button>
                    </form>
                ) : (
                    <p><strong>Status:</strong> {status}</p>
                )}
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Status'}
                </button>
            </div>

            <div className="action-buttons">
                <button onClick={handleDelete} className="btn btn-danger">Delete Application</button>
            </div>
        </div>
    );
};

export default ApplicationsDetails;
