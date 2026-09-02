import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { login, register, error, clearError } = useAuth();

  if (!isOpen) return null;

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setValidationError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (mode === 'register' && !name.trim()) {
      setValidationError('Full Name is required');
      return;
    }

    if (!email.trim() || !password) {
      setValidationError('Email and Password are required');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    let res;
    if (mode === 'login') {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }
    setIsSubmitting(false);

    if (res && res.success) {
      // Reset form fields and close modal
      setName('');
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose}>×</button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Access your SmartCart profile and order history'
              : 'Join SmartCart to get exclusive offers and instant checkout'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('register')}
          >
            Register
          </button>
        </div>

        {/* Display Errors */}
        {(validationError || error) && (
          <div className="auth-error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : mode === 'login' ? (
              'Sign In to Account'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="auth-footer-prompt">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => handleSwitchMode('register')} className="switch-link">
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button type="button" onClick={() => handleSwitchMode('login')} className="switch-link">
                Sign in instead
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
