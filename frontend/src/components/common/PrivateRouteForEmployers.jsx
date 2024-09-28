// src/components/common/PrivateRouteForEmployers.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrivateRouteForEmployers = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const [isEmployer, setIsEmployer] = useState(false);
  const [loading, setLoading] = useState(true);
  const toastDisplayed = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('/api/profile', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const role = response.data.role;
          setIsEmployer(role === 'EMPLOYER' || role === 'ADMIN');
          if (!(role === 'EMPLOYER' || role === 'ADMIN') && !toastDisplayed.current) {
            toast.error('You need to be an employer to access this page.');
            toastDisplayed.current = true;
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setLoading(false);
        }
      };

      fetchUserRole();
    } else {
      toast.error("Please log in or register to access this page.");
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isEmployer ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/profile" />
  );
};

export default PrivateRouteForEmployers;