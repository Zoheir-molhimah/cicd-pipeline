import React, { useState, useEffect } from 'react';
import '../styles/UserManagement.css';

function UserManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (data.success) {
        setUsers([...users, data.user]);
        setNewUser({ username: '', email: '', password: '', role: 'user' });
        setShowAddForm(false);
      } else {
        alert(data.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleEditUser = userToEdit => {
    setEditingUser(userToEdit);
    setNewUser({
      username: userToEdit.username,
      email: userToEdit.email,
      password: '',
      role: userToEdit.role,
    });
    setShowAddForm(true);
  };

  const handleUpdateUser = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      };

      // Only include password if it's provided
      if (newUser.password && newUser.password.length >= 6) {
        updateData.password = newUser.password;
      }

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (data.success) {
        setUsers(
          users.map(u => (u.id === editingUser.id ? { ...u, ...data.user } : u))
        );
        setNewUser({ username: '', email: '', password: '', role: 'user' });
        setShowAddForm(false);
        setEditingUser(null);
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteUser = async userId => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Network error. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="user-management">
        <div className="auth-required">
          <h2>🔒 Authentication Required</h2>
          <p>Please log in to access user management features.</p>
          <button
            className="login-btn"
            onClick={() => window.location.reload()}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>👥 User Management</h2>
        <p>Manage users and their roles in the system</p>
        <button
          className="add-user-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingUser(null);
            setNewUser({ username: '', email: '', password: '', role: 'user' });
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-form">
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={newUser.username}
                onChange={e =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={newUser.email}
                onChange={e =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={newUser.password}
                onChange={e =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required={!editingUser}
                placeholder={
                  editingUser
                    ? 'Leave empty to keep current password'
                    : 'Enter password'
                }
              />
              {editingUser && (
                <small className="password-hint">
                  Leave empty to keep the current password
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </form>
        </div>
      )}

      <div className="users-list">
        <h3>Current Users ({users.length})</h3>
        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h4>{user.username}</h4>
                <p>{user.email}</p>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
              <div className="user-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditUser(user)}
                  title="Edit user"
                >
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                  title="Delete user"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
