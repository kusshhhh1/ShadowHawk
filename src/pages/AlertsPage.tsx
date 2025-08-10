import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock,
  User,
  Globe,
  Eye,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  user: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  details: {
    action: string;
    ip: string;
    riskScore: number;
    context?: string;
  };
}

function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const { socket } = useSocket();

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-alert', (newAlert) => {
        setAlerts(prev => [newAlert, ...prev]);
      });

      return () => {
        socket.off('new-alert');
      };
    }
  }, [socket]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      toast.error('Failed to load alerts', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    // Validate alert ID
    if (!alertId || alertId === 'undefined' || alertId === 'null') {
      toast.error('Invalid alert ID', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      await axios.patch(`/api/alerts/${alertId}/resolve`);
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );
      
      // Close modal if it's the selected alert
      if (selectedAlert?.id === alertId) {
        setSelectedAlert(null);
      }
      
      toast.success('Alert marked as resolved', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error: any) {
      console.error('Failed to resolve alert:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resolve alert';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-threat-critical';
      case 'high': return 'text-threat-high';
      case 'medium': return 'text-threat-medium';
      case 'low': return 'text-threat-low';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-threat-critical/20 border-threat-critical/30';
      case 'high': return 'bg-threat-high/20 border-threat-high/30';
      case 'medium': return 'bg-threat-medium/20 border-threat-medium/30';
      case 'low': return 'bg-threat-low/20 border-threat-low/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'active':
        return !alert.resolved;
      case 'resolved':
        return alert.resolved;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Alerts</h1>
          <p className="text-gray-400">Monitor and respond to security threats</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              filter === 'all' 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-dark-700/50 text-gray-300 hover:bg-dark-600/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              filter === 'active' 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-dark-700/50 text-gray-300 hover:bg-dark-600/50'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              filter === 'resolved' 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-dark-700/50 text-gray-300 hover:bg-dark-600/50'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className={`bg-dark-800/50 backdrop-blur-xl border rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 cursor-pointer ${
                alert.resolved ? 'opacity-75' : ''
              } ${getSeverityBg(alert.severity)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className={`h-6 w-6 mt-1 ${getSeverityColor(alert.severity)}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{alert.message}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityBg(alert.severity)} ${getSeverityColor(alert.severity)} capitalize`}>
                        {alert.severity}
                      </span>
                      {alert.resolved && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 border-green-500/30 text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{alert.user}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>{alert.details.ip}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlert(alert);
                    }}
                    className="p-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  {!alert.resolved && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveAlert(alert.id);
                      }}
                      className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No alerts found</p>
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              className="bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Alert Details</h2>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <AlertTriangle className={`h-8 w-8 mt-1 ${getSeverityColor(selectedAlert.severity)}`} />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{selectedAlert.message}</h3>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityBg(selectedAlert.severity)} ${getSeverityColor(selectedAlert.severity)} capitalize`}>
                          {selectedAlert.severity}
                        </span>
                        {selectedAlert.resolved && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 border-green-500/30 text-green-500">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-400">User</label>
                        <p className="text-white">{selectedAlert.user}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Action</label>
                        <p className="text-white">{selectedAlert.details.action}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">IP Address</label>
                        <p className="text-white">{selectedAlert.details.ip}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Risk Score</label>
                        <p className={`font-bold ${getSeverityColor(selectedAlert.severity)}`}>
                          {selectedAlert.details.riskScore}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Timestamp</label>
                        <p className="text-white">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedAlert.details.context && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Additional Context</label>
                      <p className="text-white mt-1">{selectedAlert.details.context}</p>
                    </div>
                  )}

                  {!selectedAlert.resolved && (
                    <div className="flex justify-end space-x-3 pt-4 border-t border-dark-600/50">
                      <motion.button
                        onClick={() => setSelectedAlert(null)}
                        className="px-4 py-2 bg-dark-700/50 text-gray-300 rounded-xl hover:bg-dark-600/50 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Close
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          resolveAlert(selectedAlert.id);
                          setSelectedAlert(null);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Mark as Resolved</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AlertsPage;