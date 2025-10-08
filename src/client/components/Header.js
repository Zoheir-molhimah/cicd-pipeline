import React from 'react';
import '../styles/Header.css';

function Header({ user, onLogout, currentView, onViewChange }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🚀 CICD Pipeline</h1>
          <span className="subtitle">Multi-Developer Website</span>
        </div>

        <nav className="navigation">
          <button
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${currentView === 'users' ? 'active' : ''}`}
            onClick={() => onViewChange('users')}
          >
            👥 Users
          </button>
          <button
            className={`nav-btn ${currentView === 'chat' ? 'active' : ''}`}
            onClick={() => onViewChange('chat')}
          >
            💬 Chat
          </button>
        </nav>

        <div className="user-section">
          {user ? (
            <div className="user-info">
              <span className="user-name">👤 {user.username}</span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="login-btn"
                onClick={() => onViewChange('login')}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
