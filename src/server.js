const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert default admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT OR IGNORE INTO users (username, email, password, role) 
          VALUES ('admin', 'admin@cicd-pipeline.com', ?, 'admin')`,
    [hashedPassword]
  );
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/client')));

// Socket.IO connection handling
io.on('connection', socket => {
  // User connected: socket.id

  // Send chat history to new user
  db.all(
    'SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50',
    (err, rows) => {
      if (!err) {
        socket.emit('chatHistory', rows.reverse());
      }
    }
  );

  // Handle new messages
  socket.on('message', message => {
    // Save message to database
    db.run(
      'INSERT INTO messages (username, text) VALUES (?, ?)',
      [message.username, message.text],
      function (err) {
        if (!err) {
          message.id = this.lastID;
          message.timestamp = new Date().toISOString();
          io.emit('message', message);
        }
      }
    );
  });

  socket.on('disconnect', () => {
    // User disconnected: socket.id
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/client/index.html');
  
  // Check if the file exists, if not, serve a simple response
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback for testing or when dist folder doesn't exist
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CICD Pipeline</title>
        </head>
        <body>
          <h1>CICD Pipeline Application</h1>
          <p>Server is running successfully!</p>
          <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
        </body>
      </html>
    `);
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  db.all('SELECT COUNT(*) as count FROM users', (err, userCount) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Database error' });
    }

    db.all('SELECT COUNT(*) as count FROM messages', (err, messageCount) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Database error' });
      }

      res.json({
        success: true,
        stats: {
          totalUsers: userCount[0].count,
          activeUsers: io.engine.clientsCount,
          messages: messageCount[0].count,
          uptime: Math.floor(process.uptime()),
        },
      });
    });
  });
});

// User management routes
app.get('/api/users', authenticateToken, (req, res) => {
  db.all(
    'SELECT id, username, email, role, created_at FROM users',
    (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Database error' });
      }
      res.json({ success: true, users: rows });
    }
  );
});

app.post('/api/users', authenticateToken, (req, res) => {
  const { username, email, password, role } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role],
    function (err) {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: 'User already exists' });
      }

      res.json({
        success: true,
        user: { id: this.lastID, username, email, role },
      });
    }
  );
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const { username, email, password, role } = req.body;

  let updateQuery = 'UPDATE users SET username = ?, email = ?, role = ?';
  const updateParams = [username, email, role];

  // Only update password if provided
  if (password && password.length >= 6) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    updateQuery += ', password = ?';
    updateParams.push(hashedPassword);
  }

  updateQuery += ' WHERE id = ?';
  updateParams.push(userId);

  db.run(updateQuery, updateParams, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message:
          'Failed to update user. Username or email might already exist.',
      });
    }

    if (this.changes === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: { id: userId, username, email, role },
      message: 'User updated successfully',
    });
  });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;

  db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Database error' });
    }

    if (this.changes === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Only start server if this file is run directly
if (require.main === module) {
  server.listen(PORT, () => {
    // Server started successfully
  });
}

module.exports = app;
