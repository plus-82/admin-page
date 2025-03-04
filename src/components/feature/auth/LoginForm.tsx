import React, { useState } from 'react';
import Input from '../../common/FormElements/Input';
import Button from '../../common/Button/Button';
import { LoginCredentials } from '../../../types/auth';
import { useAuth } from '../../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const { login, loading, error } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      
      <Input
        type="email"
        name="email"
        label="Email"
        value={credentials.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
        required
        fullWidth
        autoFocus
      />
      
      <Input
        type="password"
        name="password"
        label="Password"
        value={credentials.password}
        onChange={handleInputChange}
        placeholder="Enter your password"
        required
        fullWidth
      />
      
      {error && <div className="login-error">{error}</div>}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={loading}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;