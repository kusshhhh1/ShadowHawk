import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Alert from '../models/Alert.js';
import Log from '../models/Log.js';

const router = express.Router();

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Dashboard route accessible',
    cookies: req.cookies,
    headers: req.headers
  });
});

// Get dashboard data
router.get('/data', authenticateToken, async (req, res) => {
  console.log('Dashboard request from user:', req.user.email);
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const suspendedUsers = totalUsers - activeUsers;

    // Get alert statistics
    const totalAlerts = await Alert.countDocuments();
    const unresolvedAlerts = await Alert.countDocuments({ resolved: false });
    const criticalAlerts = await Alert.countDocuments({ severity: 'critical', resolved: false });

    // Get recent activity
    const recentActivity = await Log.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('user action createdAt riskScore ip');

    // Get risk score trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const riskTrendData = await Log.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgRiskScore: { $avg: "$riskScore" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get threat distribution
    const threatDistribution = await Log.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $gte: ["$riskScore", 50] },
              "Critical",
              {
                $cond: [
                  { $gte: ["$riskScore", 30] },
                  "High",
                  {
                    $cond: [
                      { $gte: ["$riskScore", 15] },
                      "Medium",
                      "Low"
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get login location analytics
    const loginLocations = await Log.aggregate([
      {
        $match: {
          action: { $regex: /login/i }
        }
      },
      {
        $group: {
          _id: "$ip",
          count: { $sum: 1 },
          lastLogin: { $max: "$createdAt" },
          users: { $addToSet: "$user" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Calculate security score
    const securityScore = Math.max(0, 100 - (unresolvedAlerts * 10) - (suspendedUsers * 5));

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalAlerts,
        unresolvedAlerts,
        criticalAlerts,
        securityScore
      },
      recentActivity,
      riskTrendData,
      threatDistribution,
      loginLocations
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

export default router;