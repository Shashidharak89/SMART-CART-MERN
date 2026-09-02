import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfileSidebar.css';

const ProfileSidebar = ({ isOpen, onClose, onOpenAuth, onOpenCart }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar-drawer slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">
              {user ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="sidebar-user-details">
              <h3 className="sidebar-user-name">{user ? user.name : 'Guest User'}</h3>
              <p className="sidebar-user-email">{user ? user.email : 'Sign in to access your profile'}</p>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Navigation Options */}
        <div className="sidebar-body">
          <div className="sidebar-section-title">Navigation</div>
          <nav className="sidebar-nav">
            <button
              className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => handleNav('/')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home Page
            </button>

            <button
              className={`sidebar-link ${location.pathname === '/products' ? 'active' : ''}`}
              onClick={() => handleNav('/products')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Explore Products
            </button>

            <button
              className="sidebar-link"
              onClick={() => {
                onClose();
                onOpenCart();
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Shopping Cart
            </button>
          </nav>

          <div className="sidebar-divider"></div>

          {/* Account Actions */}
          <div className="sidebar-section-title">Account</div>
          {user ? (
            <div className="sidebar-account-menu">
              <div className="user-info-box">
                <p><strong>Member ID:</strong> #{user._id.slice(-6).toUpperCase()}</p>
                <p><strong>Status:</strong> Active 7-Day Session</p>
              </div>

              <button className="sidebar-btn danger" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="sidebar-guest-actions">
              <button
                className="btn btn-primary sidebar-auth-btn"
                onClick={() => {
                  onClose();
                  onOpenAuth('login');
                }}
              >
                Sign In
              </button>
              <button
                className="btn btn-secondary sidebar-auth-btn"
                onClick={() => {
                  onClose();
                  onOpenAuth('register');
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
