import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Alert from '../models/Alert.js';
import Log from '../models/Log.js';

const router = express.Router();

// AI Assistant endpoint
router.post('/assistant', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const question = message.toLowerCase();

    let response = '';

    // User-related queries
    if (question.includes('user') || question.includes('name') || question.includes('list')) {
      if (question.includes('all') || question.includes('list')) {
        const users = await User.find({}, 'name email role isActive createdAt');
        const userList = users.map(user => 
          `• ${user.name} (${user.email}) - Role: ${user.role} - Status: ${user.isActive ? 'Active' : 'Suspended'}`
        ).join('\n');
        
        response = `Based on your current data, here are the users in your system:\n\n${userList}\n\nTotal users: ${users.length} accounts`;
      } else {
        response = "I can help you with user information. Would you like me to list all users, show high-risk users, or provide specific user details?";
      }
    }

    // Risk score queries
    else if (question.includes('risk') || question.includes('score')) {
      if (question.includes('kush') || question.includes('specific')) {
        const user = await User.findOne({ name: { $regex: /kush/i } });
        if (user) {
          // Get user's recent activity risk score
          const recentLogs = await Log.find({ user: user.name }).sort({ timestamp: -1 }).limit(10);
          const avgRiskScore = recentLogs.length > 0 
            ? Math.round(recentLogs.reduce((sum, log) => sum + log.riskScore, 0) / recentLogs.length)
            : 0;
          
          response = `${user.name} has an average risk score of ${avgRiskScore} based on recent activity. Current status: ${user.isActive ? 'Active' : 'Suspended'}`;
        } else {
          response = "User not found. Please check the spelling or try listing all users.";
        }
      } else {
        const users = await User.find({}, 'name email isActive');
        const userRiskData = await Promise.all(users.map(async (user) => {
          const recentLogs = await Log.find({ user: user.name }).sort({ timestamp: -1 }).limit(5);
          const avgRiskScore = recentLogs.length > 0 
            ? Math.round(recentLogs.reduce((sum, log) => sum + log.riskScore, 0) / recentLogs.length)
            : 0;
          return { name: user.name, riskScore: avgRiskScore, isActive: user.isActive };
        }));
        
        const sortedUsers = userRiskData.sort((a, b) => b.riskScore - a.riskScore);
        const riskList = sortedUsers.map(user => 
          `• ${user.name}: ${user.riskScore} (${user.isActive ? 'Active' : 'Suspended'})`
        ).join('\n');
        
        response = `Current risk scores:\n\n${riskList}`;
      }
    }

    // Alert queries
    else if (question.includes('alert') || question.includes('triggered') || question.includes('most')) {
      if (question.includes('most') || question.includes('triggered')) {
        const alerts = await Alert.find({}, 'user message severity timestamp');
        const userAlertCounts = {};
        
        alerts.forEach(alert => {
          userAlertCounts[alert.user] = (userAlertCounts[alert.user] || 0) + 1;
        });
        
        const sortedUsers = Object.entries(userAlertCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);
        
        const alertList = sortedUsers.map(([user, count]) => 
          `• ${user}: ${count} alerts`
        ).join('\n');
        
        response = `Users who triggered the most alerts:\n\n${alertList}`;
      } else {
        const unresolvedAlerts = await Alert.find({ resolved: false }).sort({ createdAt: -1 }).limit(5);
        const alertList = unresolvedAlerts.map(alert => 
          `• ${alert.user}: ${alert.message} (${alert.severity})`
        ).join('\n');
        
        response = `You currently have ${unresolvedAlerts.length} active alerts:\n\n${alertList}`;
      }
    }

    // Activity queries
    else if (question.includes('activity') || question.includes('active') || question.includes('recent')) {
      const recentLogs = await Log.find({}).sort({ timestamp: -1 }).limit(10);
      const activityList = recentLogs.map(log => 
        `• ${log.user}: ${log.action} (Risk: ${log.riskScore})`
      ).join('\n');
      
      response = `Recent activity:\n\n${activityList}`;
    }

    // Security score queries
    else if (question.includes('security') || question.includes('overall')) {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const unresolvedAlerts = await Alert.countDocuments({ resolved: false });
      
      const securityScore = Math.max(0, 100 - (unresolvedAlerts * 10) - ((totalUsers - activeUsers) * 5));
      
      response = `Your overall security score is ${securityScore}/100. You have ${unresolvedAlerts} unresolved alerts and ${totalUsers - activeUsers} suspended users.`;
    }

    // Default response
    else {
      response = `I understand you're asking about "${message}". I can help you with user information, security alerts, risk scores, and activity monitoring. Try asking me about users, alerts, or recent activity!`;
    }

    res.json({ response });
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ response: 'Sorry, I encountered an error. Please try again.' });
  }
});

export default router; 