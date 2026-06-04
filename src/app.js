const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// Fake login route for integration tests
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10
});

app.post('/login', loginLimiter, (req, res) => {
  res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = app;
