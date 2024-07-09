// src/routes/Router.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correct path to useAuth
import LoginPage from '../components/Auth/Login/Login';
import Register from '../components/Auth/Register/Register';
import Dashboard from '../components/Dashboard/Dashboard';
import Home from '../pages/Home/Home';
import Layout from '../components/Layout/Layout';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
