import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  User,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    totalAlerts: number;
    unresolvedAlerts: number;
    criticalAlerts: number;
    securityScore: number;
  };
  recentActivity: Array<{
    user: string;
    action: string;
    createdAt: string;
    riskScore: number;
    ip: string;
  }>;
  riskTrendData: Array<{
    _id: string;
    avgRiskScore: number;
    count: number;
  }>;
  threatDistribution: Array<{
    _id: string;
    count: number;
  }>;
  loginLocations: Array<{
    _id: string;
    count: number;
    lastLogin: string;
    users: string[];
  }>;
}

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/dashboard/data');
      setData(response.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data', {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error || 'Failed to load dashboard data'}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Chart data for Risk Score Trend
  const riskTrendChartData = {
    labels: data.riskTrendData.map(item => item._id),
    datasets: [
      {
        label: 'Average Risk Score',
        data: data.riskTrendData.map(item => Math.round(item.avgRiskScore)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const riskTrendChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 1)',
        },
      },
    },
  };

  // Chart data for Threat Distribution
  const threatDistributionChartData = {
    labels: data.threatDistribution.map(item => item._id),
    datasets: [
      {
        data: data.threatDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(220, 38, 38, 0.8)', // Critical - Red
          'rgba(239, 68, 68, 0.8)', // High - Orange
          'rgba(245, 158, 11, 0.8)', // Medium - Yellow
          'rgba(16, 185, 129, 0.8)', // Low - Green
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const threatDistributionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(156, 163, 175, 1)',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
        <p className="text-gray-400">Monitor your organization's security status in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{data.stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold text-white">{data.stats.unresolvedAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Security Score</p>
              <p className="text-2xl font-bold text-white">{data.stats.securityScore}/100</p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Critical Alerts</p>
              <p className="text-2xl font-bold text-white">{data.stats.criticalAlerts}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-threat-critical" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Trend */}
        <motion.div
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Risk Score Trend</h3>
            <TrendingUp className="h-5 w-5 text-primary-500" />
          </div>
          {data.riskTrendData.length > 0 ? (
            <Line data={riskTrendChartData} options={riskTrendChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </motion.div>

        {/* Threat Distribution */}
        <motion.div
          className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Threat Distribution</h3>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          {data.threatDistribution.length > 0 ? (
            <Doughnut data={threatDistributionChartData} options={threatDistributionChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Login Location Analytics */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Login Location Analytics</h3>
          <MapPin className="h-5 w-5 text-blue-500" />
        </div>
        {data.loginLocations.length > 0 ? (
          <div className="space-y-3">
            {data.loginLocations.slice(0, 5).map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">{location._id}</p>
                    <p className="text-sm text-gray-400">{location.users.length} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{location.count} logins</p>
                  <p className="text-sm text-gray-400">
                    {new Date(location.lastLogin).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p>No login data available</p>
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-xl border border-dark-600/50 rounded-2xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Activity className="h-5 w-5 text-green-500" />
        </div>
        {data.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-400">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getThreatColor(activity.riskScore)}`}>
                    Risk: {activity.riskScore}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p>No recent activity</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;