import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './ApplicationsList.css';

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('/api/applications', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications', error);
                toast.error('Error fetching applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="applications-list">
            <h2>My Applications</h2>
            {applications.length === 0 ? (
                <p>No applications found</p>
            ) : (
                <ul>
                    {applications.map((application) => (
                        <li key={application.id}>
                            <Link to={`/applications/details/${application.id}`}>{application.jobListing.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApplicationsList;
