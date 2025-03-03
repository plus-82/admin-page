import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry || Number(tokenExpiry) < Date.now()) {
      // Token is missing or expired, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpiry');
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      
      <main className="dashboard-content">
        <h2>Welcome to the Admin Dashboard</h2>
        <p>This is a placeholder dashboard page. After successful login, you will be redirected here.</p>
      </main>
    </div>
  );
};

export default Dashboard;