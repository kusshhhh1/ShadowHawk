import express from 'express';
import Log from '../models/Log.js';
import Alert from '../models/Alert.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateRiskScore, getSeverityLevel } from '../utils/riskCalculator.js';

const router = express.Router();

// Get logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, user: userFilter } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // If not admin, only show own logs
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    } else if (userFilter) {
      query.user = new RegExp(userFilter, 'i');
    }
    
    const logs = await Log.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Log.countDocuments(query);
    
    res.json({
      logs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create log (for simulation/testing)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { action, details } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    // Get user history for risk calculation
    const userHistory = await Log.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    const riskScore = calculateRiskScore(
      action,
      ip,
      req.get('User-Agent'),
      new Date(),
      userHistory
    );
    
    const log = new Log({
      user: req.user.name,
      userId: req.user._id,
      action,
      ip,
      userAgent: req.get('User-Agent'),
      riskScore,
      details
    });
    
    await log.save();
    
    // Check if we need to create an alert
    if (riskScore >= 30) {
      const severity = getSeverityLevel(riskScore);
      const alert = new Alert({
        user: req.user.name,
        userId: req.user._id,
        message: `High-risk activity detected: ${action}`,
        severity,
        details: {
          action,
          ip,
          riskScore,
          context: `Risk score of ${riskScore} triggered automatic alert`
        }
      });
      
      await alert.save();
      
      // Emit real-time alert
      const io = req.app.get('socketio');
      io.emit('new-alert', {
        id: alert._id,
        user: req.user.name,
        message: alert.message,
        severity,
        timestamp: alert.createdAt
      });
    }
    
    // Emit real-time log update
    const io = req.app.get('socketio');
    io.emit('new-log', {
      id: log._id,
      user: req.user.name,
      action,
      timestamp: log.createdAt,
      ip,
      riskScore
    });
    
    res.status(201).json({ log });
  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;