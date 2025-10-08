import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    messages: 0,
    uptime: 0,
  });

  useEffect(() => {
    // Fetch dashboard statistics
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error('Failed to fetch stats:', err));

    // Update uptime every second
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        uptime: prev.uptime + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Welcome to the CICD Pipeline Multi-Developer Website!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Messages</h3>
            <p className="stat-number">{stats.messages}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Uptime</h3>
            <p className="stat-number">{formatUptime(stats.uptime)}</p>
          </div>
        </div>
      </div>

      <div className="developer-sections">
        <div className="dev-section">
          <h3>🎨 Frontend Developer Area</h3>
          <p>This area is managed by Developer 1 - Frontend specialist</p>
          <div className="dev-features">
            <div className="feature-item">✅ Responsive Design</div>
            <div className="feature-item">✅ Modern UI Components</div>
            <div className="feature-item">✅ CSS Animations</div>
            <div className="feature-item">✅ Mobile Optimization</div>
          </div>
        </div>

        <div className="dev-section">
          <h3>⚛️ React & Database Developer Area</h3>
          <p>
            This area is managed by Developer 2 - React & Database specialist
          </p>
          <div className="dev-features">
            <div className="feature-item">✅ React Components</div>
            <div className="feature-item">✅ State Management</div>
            <div className="feature-item">✅ Database Integration</div>
            <div className="feature-item">✅ API Endpoints</div>
          </div>
        </div>

        <div className="dev-section">
          <h3>🔧 Additional Features Area</h3>
          <p>
            This area is managed by Developer 3 - Additional features specialist
          </p>
          <div className="dev-features">
            <div className="feature-item">✅ Real-time Chat</div>
            <div className="feature-item">✅ File Upload</div>
            <div className="feature-item">✅ Notifications</div>
            <div className="feature-item">✅ Analytics</div>
          </div>
        </div>
      </div>

      {user && (
        <div className="user-welcome">
          <h3>Welcome back, {user.username}!</h3>
          <p>You&apos;re logged in and ready to explore the features.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
