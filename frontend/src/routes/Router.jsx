import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

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
import ApplicationsList from '../components/Applications/ApplicationsList/ApplicationsList';
import ApplicationsDetails from '../components/Applications/ApplicationsDetails/ApplicationsDetails';
import EditApplications from '../components/Applications/EditApplication/EditApplication';
import ApplyApplicationPage from '../components/Applications/ApplyApplication/ApplyApplicationPage';
import NotFound from "../components/Error/NotFound/NotFound";
import PrivateRouteForEmployers from "../components/common/PrivateRouteForEmployers";
import Projects from '../pages/Projects/Projects';
import Tasks from '../pages/Tasks/Tasks';
import AddProject from '../components/Projects/AddProject/AddProject';
import EditProject from '../components/Projects/EditProject/EditProject';
import ProjectDetails from '../components/Projects/ProjectDetails/ProjectDetails';
import AddTask from '../components/Tasks/AddTask/AddTask';
import EditTask from '../components/Tasks/EditTask/EditTask';
import TaskDetails from '../components/Tasks/TaskDetails/TaskDetails';
import Teams from '../pages/Teams/Teams';
import AddTeam from '../components/Teams/AddTeam/AddTeam';
import EditTeam from '../components/Teams/EditTeam/EditTeam';
import TeamDetails from '../components/Teams/TeamDetails/TeamDetails';
import CompletedTasks from "../components/Tasks/CompletedTasks/CompletedTasks";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.error("Please log in or register to access this page.");
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

const AuthenticatedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Dashboard /> : <Home />; // Redirect to dashboard if logged in, else home
};

const AppRouter = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AuthenticatedRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
          <Route path="/resume" element={<ProtectedRoute element={ResumePage} />} />
          <Route path="/joblistings" element={<ProtectedRoute element={JobListings} />} />
          <Route path="/joblistings/add" element={<PrivateRouteForEmployers element={AddJobListing} />} />
          <Route path="/joblistings/edit/:id" element={<PrivateRouteForEmployers element={EditJobListing} />} />
          <Route path="/joblistings/:id" element={<ProtectedRoute element={JobDetails} />} />
          <Route path="/applications" element={<ApplicationsList />} />
          <Route path="/applications/details/:id" element={<ApplicationsDetails />} />
          <Route path="/applications/edit/:id" element={<EditApplications />} />
          <Route path="/apply/:jobId" element={<ApplyApplicationPage />} />
          <Route path="/projects" element={<ProtectedRoute element={Projects} />} />
          <Route path="/projects/add" element={<ProtectedRoute element={AddProject} />} />
          <Route path="/projects/edit/:id" element={<ProtectedRoute element={EditProject} />} />
          <Route path="/projects/:id" element={<ProtectedRoute element={ProjectDetails} />} />
          <Route path="/tasks" element={<ProtectedRoute element={Tasks} />} />
          <Route path="/tasks/add" element={<ProtectedRoute element={AddTask} />} />
          <Route path="/tasks/edit/:id" element={<ProtectedRoute element={EditTask} />} />
          <Route path="/tasks/:id" element={<ProtectedRoute element={TaskDetails} />} />
          <Route path="/completed-tasks" element={<ProtectedRoute element={CompletedTasks} />} />
          <Route path="/teams" element={<ProtectedRoute element={Teams} />} />
          <Route path="/teams/add" element={<PrivateRouteForEmployers element={AddTeam} />} />
          <Route path="/teams/edit/:id" element={<PrivateRouteForEmployers element={EditTeam} />} />
          <Route path="/teams/:id" element={<ProtectedRoute element={TeamDetails} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
