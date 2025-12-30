const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register (customer)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Register request received:', { name, email, hasPassword: !!password });
    
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'User already exists' });

    // Don't hash here - let the User model's pre-save hook handle it
    const user = new User({ name: name || email, email, password, role: 'user' });
    await user.save();
    console.log('User registered successfully:', user.email);

    const userObj = user.toObject();
    delete userObj.password;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ token, user: userObj });
  } catch (err) {
    console.error('Register error', err);
    // Provide more specific error messages
    if (err.code === 11000) {
      return res.status(409).json({ message: 'User already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message || 'Validation error' });
    }
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Login (customer/admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
