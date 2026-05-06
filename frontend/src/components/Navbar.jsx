import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/api';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!getAuthToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2>📋 Task Manager</h2>
        </div>
        {isAuthenticated ? (
          <div className="nav-links">
            <a href="/dashboard">Dashboard</a>
            <a href="/projects">Projects</a>
            <a href="/tasks">Tasks</a>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="nav-links">
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
