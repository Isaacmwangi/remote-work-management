// src/routes/Router.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LoginPage from "../components/Auth/Login/Login";
import Register from "../components/Auth/Register/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ResumePage from "../pages/Resume_Page/ResumePage";
import Home from "../pages/Home/Home";
import Layout from "../components/Layout/Layout";
import JobListings from "../components/JobListings/Job_Listing/JobListings.component";
import AddJobListing from "../components/JobListings/Add_Job/AddJobListing.component";
import EditJobListing from "../components/JobListings/Edit_Job/EditJobListing.component";
import JobDetails from "../components/JobListings/Job_Details/JobListingDetails";
import NotFound from "../components/Error/NotFound/NotFound";
import PrivateRouteForEmployers from "../components/common/PrivateRouteForEmployers";

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Home />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/resume"
            element={
              isAuthenticated ? <ResumePage /> : <Navigate to="/login" />
            }
          />
          <Route path="/joblistings" element={<JobListings />} />
          <Route
            path="/joblistings/add"
            element={<PrivateRouteForEmployers element={AddJobListing} />}
          />
          <Route path="/joblistings/:id" element={<JobDetails />} />
          <Route
            path="/edit-job/:id"
            element={
              isAuthenticated ? <EditJobListing /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
