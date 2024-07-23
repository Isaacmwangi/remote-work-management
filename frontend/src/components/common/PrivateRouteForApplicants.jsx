// src/components/common/PrivateRouteForApplicants.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PrivateRouteForApplicants is a higher-order component that restricts access
 * to routes for authenticated job seekers only.
 * 
 * @param {Object} props - The component props.
 * @param {JSX.Element} props.element - The component to render if access is allowed.
 * @param {string} props.path - The path for the route.
 * @param {Object} props.rest - Additional props for the Route component.
 * 
 * @returns {JSX.Element} The route component with conditional rendering.
 */
const PrivateRouteForApplicants = ({ element: Element, ...rest }) => {
    const { user } = useAuth();

    return (
        <Route
            {...rest}
            element={
                user && user.role === 'applicant' ? (
                    <Element />
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
    );
};

export default PrivateRouteForApplicants;
