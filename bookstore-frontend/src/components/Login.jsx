/**
 * Login Component
 * Handles admin authentication for the bookstore management system
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(credentials.username, credentials.password);
      
      if (result.success) {
        onClose(); // Close the login modal
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>Admin Login</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close login"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter admin username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="login-actions">
            <button
              type="submit"
              className="btn btn-emerald"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="login-info">
          <p><small>Note: Guests can browse the library without logging in</small></p>
          <p><small>Administrator access is required for content management</small></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
