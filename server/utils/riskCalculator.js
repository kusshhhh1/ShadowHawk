export const calculateRiskScore = (action, ip, userAgent, timestamp, userHistory = []) => {
  let riskScore = 0;
  const hour = new Date(timestamp).getHours();
  
  // Base risk for different actions
  const actionRisks = {
    'login': 5,
    'logout': 1,
    'file_download': 10,
    'file_upload': 8,
    'system_access': 15,
    'password_change': 20,
    'admin_action': 25,
    'data_export': 30
  };
  
  riskScore += actionRisks[action] || 5;
  
  // Time-based risk (late night/early morning)
  if (hour >= 22 || hour <= 6) {
    riskScore += 15;
  }
  
  // Weekend risk
  const dayOfWeek = new Date(timestamp).getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    riskScore += 10;
  }
  
  // Check for new IP address
  const recentIPs = userHistory.slice(-10).map(log => log.ip);
  if (!recentIPs.includes(ip)) {
    riskScore += 20;
  }
  
  // Frequency analysis (too many actions in short time)
  const recentActions = userHistory.filter(log => 
    new Date(timestamp) - new Date(log.createdAt) < 60 * 60 * 1000 // Last hour
  );
  
  if (recentActions.length > 10) {
    riskScore += 25;
  }
  
  // File size risk (for downloads/uploads)
  if (action.includes('file') && Math.random() > 0.7) { // Simulate large file
    riskScore += 20;
  }
  
  return Math.min(riskScore, 100); // Cap at 100
};

export const getSeverityLevel = (riskScore) => {
  if (riskScore >= 70) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
};