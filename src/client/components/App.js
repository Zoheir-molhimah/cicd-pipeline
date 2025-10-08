import React, { useState, useEffect } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import RealTimeChat from './RealTimeChat';
import Login from './Login';
import '../styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(err => {
          console.error('Auth verification failed:', err);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleLogin = userData => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleViewChange = view => {
    if (view === 'login') {
      setShowLogin(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="app">
      <Header
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard user={user} />}
        {currentView === 'users' && <UserManagement user={user} />}
        {currentView === 'chat' && <RealTimeChat user={user} />}
      </main>

      {showLogin && (
        <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
      )}
    </div>
  );
}

export default App;
