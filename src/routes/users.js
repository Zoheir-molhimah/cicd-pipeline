// Backend API Developer - Your files to work on
// This is your responsibility area

// Example: API route
const express = require('express');
const router = express.Router();

// Your API endpoints
router.get('/api/users', (req, res) => {
  res.json({ message: 'Users API endpoint' });
});

router.post('/api/users', (req, res) => {
  res.json({ message: 'Create user endpoint' });
});

module.exports = router;

// Your files:
// - src/server.js (Main server file)
// - src/routes/ (API routes)
// - src/middleware/ (Server middleware)
// - src/auth/ (Authentication logic)
// - src/config/ (Server configuration)

// DO NOT modify:
// - src/client/ (Frontend Developer's responsibility)
// - src/components/ (React Developer's responsibility)
// - webpack.config.js (Frontend Developer's responsibility)
