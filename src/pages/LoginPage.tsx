import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/feature/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to users page if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <h1>Admin Panel</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;