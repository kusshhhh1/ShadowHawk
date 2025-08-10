import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Shield, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Search,
  User,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import AICopilot from './AICopilot';
import SettingsModal from './SettingsModal';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Alert {
  id: string;
  user: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
}

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed
  const [aiCopilotOpen, setAICopilotOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-alert', (newAlert: Alert) => {
        setNotifications(prev => [newAlert, ...prev.slice(0, 4)]);
        setUnreadCount(prev => prev + 1);
        toast.error(`New ${newAlert.severity} alert: ${newAlert.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      return () => {
        socket.off('new-alert');
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/alerts?resolved=false&limit=5');
      setNotifications(response.data.alerts);
      setUnreadCount(response.data.alerts.length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNotificationClick = (alert: Alert) => {
    setNotificationsOpen(false);
    navigate('/alerts');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Security Alerts', href: '/alerts', icon: Shield },
    { name: 'Activity Logs', href: '/logs', icon: FileText },
    { name: 'User Management', href: '/users', icon: Users },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1126] via-[#0a0f1d] to-[#060b23]">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              className="fixed left-0 top-0 h-full w-80 bg-dark-800/95 backdrop-blur-xl border-r border-dark-600/50 overflow-y-auto"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Mobile sidebar content */}
              <div className="flex items-center justify-between p-4 border-b border-dark-600/50">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-primary-500" />
                  <span className="text-xl font-bold text-white">ShadowHawk</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-dark-700/50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-dark-600/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAICopilotOpen(true)}
                  className="flex items-center space-x-3 w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 mb-2"
                >
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Copilot</span>
                </button>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-300 mb-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'
      }`}>
        <div className="flex flex-col h-full bg-dark-800/95 backdrop-blur-xl border-r border-dark-600/50">
          {/* Logo - acts as toggle button */}
          <div className="flex-shrink-0 p-4 border-b border-dark-600/50">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`flex items-center w-full hover:bg-dark-700/50 rounded-xl p-2 transition-all duration-300 ${
                sidebarCollapsed ? 'justify-center' : 'space-x-3'
              }`}
            >
              <Shield className="h-8 w-8 text-primary-500 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-xl font-bold text-white">ShadowHawk</span>}
            </button>
          </div>

          {/* Navigation - Compact spacing */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700/50'
                  } ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                  {sidebarCollapsed && <span className="sr-only">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section - Sticky footer */}
          <div className="flex-shrink-0 p-4 border-t border-dark-600/50">
            {!sidebarCollapsed && (
              <>
                {/* User Profile */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                
                {/* AI Copilot */}
                <button
                  onClick={() => setAICopilotOpen(true)}
                  className="flex items-center space-x-3 w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 mb-2"
                >
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Copilot</span>
                </button>
                
                {/* Settings */}
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-300 mb-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>
                
                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-80'
      }`}>
        {/* Header */}
        <header className="bg-dark-800/50 backdrop-blur-xl border-b border-dark-600/50 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-80 bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl shadow-2xl z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b border-dark-600/50">
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        <p className="text-sm text-gray-400">{notifications.length} unread alerts</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((alert) => (
                            <div
                              key={alert.id}
                              onClick={() => handleNotificationClick(alert)}
                              className="p-4 hover:bg-dark-700/50 cursor-pointer transition-colors border-b border-dark-600/30 last:border-b-0"
                            >
                              <div className="flex items-start space-x-3">
                                <AlertTriangle className={`h-5 w-5 mt-1 ${getSeverityColor(alert.severity)}`} />
                                <div className="flex-1">
                                  <p className="text-white font-medium">{alert.message}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                    <span className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{alert.user}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </span>
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getSeverityBg(alert.severity)} ${getSeverityColor(alert.severity)} capitalize`}>
                                    {alert.severity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-400">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No notifications</p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-4 border-t border-dark-600/50">
                          <button
                            onClick={() => {
                              setNotificationsOpen(false);
                              navigate('/alerts');
                            }}
                            className="w-full px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                          >
                            View All Alerts
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Copilot Button */}
              <button
                onClick={() => setAICopilotOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">AI Copilot</span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* AI Copilot */}
      <AICopilot isOpen={aiCopilotOpen} onClose={() => setAICopilotOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />


    </div>
  );
}

export default Layout;