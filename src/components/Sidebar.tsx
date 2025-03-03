import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link 
              to="/job-posts" 
              className={location.pathname === '/job-posts' ? 'active' : ''}
            >
              <i className="sidebar-icon">📑</i>
              Job Posts
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              className={location.pathname === '/users' ? 'active' : ''}
            >
              <i className="sidebar-icon">👥</i>
              Users
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>&copy; 2025 Admin System</p>
      </div>
    </div>
  );
};

export default Sidebar;