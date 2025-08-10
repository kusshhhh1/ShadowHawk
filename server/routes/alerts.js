import express from 'express';
import Alert from '../models/Alert.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get alerts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { resolved, limit } = req.query;
    let query = {};
    
    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }
    
    // If not admin, only show alerts for own user
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }
    
    let alertQuery = Alert.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      alertQuery = alertQuery.limit(parseInt(limit));
    }
    
    const alerts = await alertQuery.populate('resolvedBy', 'name email');
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resolve alert
router.patch('/:id/resolve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate alert ID
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ message: 'Invalid alert ID' });
    }
    
    // Check if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid alert ID format' });
    }
    
    const alert = await Alert.findById(id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Check permissions
    if (req.user.role !== 'admin' && alert.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    alert.resolved = true;
    alert.resolvedAt = new Date();
    alert.resolvedBy = req.user._id;
    
    await alert.save();
    
    res.json({ alert });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;