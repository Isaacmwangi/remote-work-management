import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; // Import an icon for user avatar
import defaultAvatar from "../../assets/avatar.png"; 

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [username, setUsername] = React.useState("");
  const [avatar, setAvatar] = React.useState(defaultAvatar); 
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsername(response.data.username);
        // Update the avatar URL based on profile data
        setAvatar(response.data.avatar ? `/api/profile/avatar/${response.data.id}` : defaultAvatar);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const UserAvatar = () =>
  avatar ? (
    <img src={avatar} alt={`${username}'s avatar`} className="avatar" />
  ) : (
    <FaUserCircle className="avatar-icon" />
  );

return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
      </div>
      <div className="navbar-center">
        {isAuthenticated && username && (
          <div className="username-container">
            <span className="username">
              <Link to="/profile">{username}</Link>
            </span>
          </div>
        )}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="profile-link">
              <UserAvatar />
              Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">
              Login
            </Link>
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
