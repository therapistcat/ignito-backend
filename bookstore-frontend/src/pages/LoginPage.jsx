/**
 * Dedicated Admin Login Page
 * Standalone login page to replace the problematic modal login system
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

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
        // Redirect to the page they were trying to access, or dashboard
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        {/* Header with back button */}
        <div className="login-page-header">
          <button 
            onClick={handleBackToDashboard}
            className="back-btn"
            aria-label="Back to Dashboard"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Login Card */}
        <div className="login-page-card">
          <div className="login-page-brand">
            <span className="brand-icon">📖</span>
            <h1>Modern Library</h1>
            <p>Management System</p>
          </div>

          <div className="login-page-form-container">
            <h2>Admin Login</h2>
            <p className="login-subtitle">Sign in to access the admin dashboard</p>

            <form onSubmit={handleSubmit} className="login-page-form">
              <div className="form-field">
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
                  className="form-input"
                />
              </div>

              <div className="form-field">
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
                  className="form-input"
                />
              </div>

              {error && (
                <div className="login-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="login-page-info">
              <div className="info-section">
                <h4>Guest Access</h4>
                <p>Guests can browse the library without logging in</p>
              </div>
              <div className="info-section">
                <h4>Admin Access</h4>
                <p>Administrator login required for content management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
