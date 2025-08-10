import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Clock,
  Globe,
  User,
  Activity,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../contexts/SocketContext';

interface Log {
  id: string;
  user: string;
  action: string;
  createdAt: string;
  ip: string;
  riskScore: number;
  details?: string;
}

function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const { socket } = useSocket();

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-log', (newLog) => {
        setLogs(prev => [newLog, ...prev]);
        setFilteredLogs(prev => [newLog, ...prev]);
      });

      return () => {
        socket.off('new-log');
      };
    }
  }, [socket]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, filterRisk]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/logs');
      setLogs(response.data.logs);
      setFilteredLogs(response.data.logs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm)
      );
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(log => {
        switch (filterRisk) {
          case 'low':
            return log.riskScore < 15;
          case 'medium':
            return log.riskScore >= 15 && log.riskScore < 30;
          case 'high':
            return log.riskScore >= 30 && log.riskScore < 50;
          case 'critical':
            return log.riskScore >= 50;
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const getThreatColor = (score: number) => {
    if (score >= 50) return 'text-threat-critical';
    if (score >= 30) return 'text-threat-high';
    if (score >= 15) return 'text-threat-medium';
    return 'text-threat-low';
  };

  const getThreatBg = (score: number) => {
    if (score >= 50) return 'bg-threat-critical/20 border-threat-critical/30';
    if (score >= 30) return 'bg-threat-high/20 border-threat-high/30';
    if (score >= 15) return 'bg-threat-medium/20 border-threat-medium/30';
    return 'bg-threat-low/20 border-threat-low/30';
  };

  const getThreatLabel = (score: number) => {
    if (score >= 50) return 'Critical';
    if (score >= 30) return 'High';
    if (score >= 15) return 'Medium';
    return 'Low';
  };

  const exportLogs = () => {
    const csvContent = [
      'User,Action,Timestamp,IP,Risk Score',
      ...filteredLogs.map(log => 
        `${log.user},${log.action},${log.createdAt},${log.ip},${log.riskScore}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shadowhawk-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

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
          <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
          <p className="text-gray-400">Monitor user activities and security events</p>
        </div>
        <motion.button
          onClick={exportLogs}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-xl hover:from-primary-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="flex-1 px-4 py-2 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterRisk('all');
            }}
            className="px-4 py-2 bg-dark-700/50 text-gray-300 rounded-xl hover:bg-dark-600/50 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/50">
              {currentLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  className="hover:bg-dark-700/30 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-white">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-300">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-300">{log.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <AlertTriangle className={`h-4 w-4 mr-2 ${getThreatColor(log.riskScore)}`} />
                      <span className={`text-sm font-medium ${getThreatColor(log.riskScore)}`}>
                        {log.riskScore}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getThreatBg(log.riskScore)} ${getThreatColor(log.riskScore)}`}>
                        {getThreatLabel(log.riskScore)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-300">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-dark-600/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <motion.button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-dark-700/50 text-gray-300 rounded-lg hover:bg-dark-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No logs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

export default LogsPage;