import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Log from '../models/Log.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateRiskScore } from '../utils/riskCalculator.js';

const router = express.Router();

// Register
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = new User({ name, email, password });
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: false, // Allow JavaScript access in development
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });
    
    // Log the signup
    const ip = req.ip || req.connection.remoteAddress;
    const riskScore = calculateRiskScore('signup', ip, req.get('User-Agent'), new Date());
    
    const log = new Log({
      user: user.name,
      userId: user._id,
      action: 'User Registration',
      ip,
      userAgent: req.get('User-Agent'),
      riskScore
    });
    await log.save();
    
    res.status(201).json({
      user: user.toJSON(),
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: false, // Allow JavaScript access in development
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });
    
    // Calculate risk and log the login
    const ip = req.ip || req.connection.remoteAddress;
    const userHistory = await Log.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);
    const riskScore = calculateRiskScore('login', ip, req.get('User-Agent'), new Date(), userHistory);
    
    const log = new Log({
      user: user.name,
      userId: user._id,
      action: 'User Login',
      ip,
      userAgent: req.get('User-Agent'),
      riskScore
    });
    await log.save();
    
    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('new-log', {
      id: log._id,
      user: user.name,
      action: 'User Login',
      timestamp: log.createdAt,
      ip,
      riskScore
    });
    
    res.json({
      user: user.toJSON(),
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
  });
  res.json({ message: 'Logout successful' });
});

export default router;