const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/database');
const { AuthServiceImpl } = require('../services/AuthService');
const authService = new AuthServiceImpl(db, bcrypt, jwt);

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 