import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-dumbbell"></i>
          <span>FitFlex Gym</span>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/classes" className="nav-link">
              Classes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/trainers" className="nav-link">
              Trainers
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/membership" className="nav-link">
              Membership
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add" className="nav-link">
              Join Now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;