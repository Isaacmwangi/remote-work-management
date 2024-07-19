// src/components/common/PrivateRouteForEmployers.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PrivateRouteForEmployers = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const [isEmployer, setIsEmployer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('/api/profile', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setIsEmployer(response.data.role === 'EMPLOYER' || 'ADMIN');
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setLoading(false);
        }
      };

      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated && isEmployer ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRouteForEmployers;
