import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>💰 Finance Manager</h1>
        </div>
        
        {user && (
          <div className="navbar-user">
            <span className="user-name">👤 {user.name}</span>
            <button onClick={handleLogout} className="logout-btn-nav">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;