import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaGraduationCap className="logo-icon" />
          <span>Home Tuition</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/pricing" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </Link>
          <Link to="/find-tutor" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Find Tutor
          </Link>
          <Link to="/contact" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>

          {isAuthenticated ? (
            <div className="navbar-profile">
              <button className="profile-button" onClick={toggleProfile}>
                <FaUser className="profile-icon" />
                <span>{user?.name}</span>
              </button>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <FaUser className="profile-avatar" />
                    <div>
                      <div className="profile-name">{user?.name}</div>
                      <div className="profile-role">
                        {user?.role === 'student' && <FaGraduationCap />}
                        {user?.role === 'teacher' && <FaChalkboardTeacher />}
                        {user?.role === 'admin' && <FaUser />}
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-links">
                    {user?.role === 'student' && (
                      <Link 
                        to="/student-dashboard" 
                        className="profile-link"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    {user?.role === 'teacher' && (
                      <Link 
                        to="/teacher-dashboard" 
                        className="profile-link"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="profile-link" onClick={() => setIsProfileOpen(false)}>Admin Panel</Link>
                      )}
                    <button className="profile-link logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

