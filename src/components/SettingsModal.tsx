import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Palette,
  Info,
  Download,
  Globe,
  Lock,
  User
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'about', name: 'About', icon: Info },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSaveSettings = () => {
    // TODO: Implement settings save functionality
    console.log('Settings saved:', {
      darkMode,
      emailNotifications,
      pushNotifications,
      autoRefresh
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-600/50">
              <div className="flex items-center space-x-3">
                <Settings className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold text-white">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex h-[600px]">
              {/* Sidebar */}
              <div className="w-64 bg-dark-700/30 border-r border-dark-600/50 overflow-y-auto">
                <nav className="p-4 space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-primary-500 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-dark-600/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'general' && (
                      <motion.div
                        key="general"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-semibold text-white mb-6">General Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                            <div>
                              <h4 className="text-white font-medium">Auto Refresh</h4>
                              <p className="text-sm text-gray-400">Automatically refresh data every 30 seconds</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                            <div>
                              <h4 className="text-white font-medium">Language</h4>
                              <p className="text-sm text-gray-400">Select your preferred language</p>
                            </div>
                            <select className="px-4 py-2 bg-dark-600/50 border border-dark-500/50 rounded-lg text-white focus:outline-none focus:border-primary-500">
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                            <div>
                              <h4 className="text-white font-medium">Time Zone</h4>
                              <p className="text-sm text-gray-400">Set your local time zone</p>
                            </div>
                            <select className="px-4 py-2 bg-dark-600/50 border border-dark-500/50 rounded-lg text-white focus:outline-none focus:border-primary-500">
                              <option value="UTC">UTC</option>
                              <option value="EST">Eastern Time</option>
                              <option value="PST">Pacific Time</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'appearance' && (
                      <motion.div
                        key="appearance"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-semibold text-white mb-6">Appearance</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                            <div className="flex items-center space-x-3">
                              {darkMode ? <Moon className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                              <div>
                                <h4 className="text-white font-medium">Dark Mode</h4>
                                <p className="text-sm text-gray-400">Use dark theme for better visibility</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                            </label>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-dark-700/30 rounded-xl border-2 border-primary-500">
                              <div className="w-full h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg mb-2"></div>
                              <p className="text-white text-sm font-medium">Primary</p>
                            </div>
                            <div className="p-4 bg-dark-700/30 rounded-xl border-2 border-transparent hover:border-gray-500 cursor-pointer">
                              <div className="w-full h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mb-2"></div>
                              <p className="text-white text-sm font-medium">Purple</p>
                            </div>
                            <div className="p-4 bg-dark-700/30 rounded-xl border-2 border-transparent hover:border-gray-500 cursor-pointer">
                              <div className="w-full h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mb-2"></div>
                              <p className="text-white text-sm font-medium">Green</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                      <motion.div
                        key="notifications"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-semibold text-white mb-6">Notifications</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                            <div>
                              <h4 className="text-white font-medium">Email Notifications</h4>
                              <p className="text-sm text-gray-400">Receive alerts via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                            <div>
                              <h4 className="text-white font-medium">Push Notifications</h4>
                              <p className="text-sm text-gray-400">Show browser notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pushNotifications}
                                onChange={(e) => setPushNotifications(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                            </label>
                          </div>

                          <div className="p-4 bg-dark-700/30 rounded-xl">
                            <h4 className="text-white font-medium mb-3">Notification Types</h4>
                            <div className="space-y-3">
                              <label className="flex items-center space-x-3">
                                <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-dark-600 text-primary-500 focus:ring-primary-500" />
                                <span className="text-white">Critical Alerts</span>
                              </label>
                              <label className="flex items-center space-x-3">
                                <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-dark-600 text-primary-500 focus:ring-primary-500" />
                                <span className="text-white">User Activity</span>
                              </label>
                              <label className="flex items-center space-x-3">
                                <input type="checkbox" className="rounded border-gray-600 bg-dark-600 text-primary-500 focus:ring-primary-500" />
                                <span className="text-white">System Updates</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'security' && (
                      <motion.div
                        key="security"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-dark-700/30 rounded-xl">
                            <div className="flex items-center space-x-3 mb-3">
                              <Lock className="h-5 w-5 text-green-500" />
                              <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">Add an extra layer of security to your account</p>
                            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                              Enable 2FA
                            </button>
                          </div>

                          <div className="p-4 bg-dark-700/30 rounded-xl">
                            <div className="flex items-center space-x-3 mb-3">
                              <Globe className="h-5 w-5 text-blue-500" />
                              <h4 className="text-white font-medium">Session Management</h4>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">Manage your active sessions</p>
                            <button className="px-4 py-2 bg-dark-600/50 text-white rounded-lg hover:bg-dark-500/50 transition-colors">
                              View Sessions
                            </button>
                          </div>

                          <div className="p-4 bg-dark-700/30 rounded-xl">
                            <div className="flex items-center space-x-3 mb-3">
                              <Download className="h-5 w-5 text-purple-500" />
                              <h4 className="text-white font-medium">Data Export</h4>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">Export your security data</p>
                            <button className="px-4 py-2 bg-dark-600/50 text-white rounded-lg hover:bg-dark-500/50 transition-colors">
                              Export Data
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'about' && (
                      <motion.div
                        key="about"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-semibold text-white mb-6">About ShadowHawk</h3>
                        
                        <div className="space-y-4">
                          <div className="p-6 bg-dark-700/30 rounded-xl text-center">
                            <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                            <h4 className="text-white text-xl font-bold mb-2">ShadowHawk Enterprise Security</h4>
                            <p className="text-gray-400 mb-4">Advanced insider threat detection and security monitoring platform</p>
                            <div className="text-sm text-gray-500">
                              <p>Version 2.0.0</p>
                              <p>© 2024 ShadowHawk Security</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-dark-700/30 rounded-xl">
                              <h5 className="text-white font-medium mb-2">Features</h5>
                              <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Real-time threat detection</li>
                                <li>• AI-powered analysis</li>
                                <li>• User behavior monitoring</li>
                                <li>• Advanced reporting</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-dark-700/30 rounded-xl">
                              <h5 className="text-white font-medium mb-2">Support</h5>
                              <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Documentation</li>
                                <li>• Contact Support</li>
                                <li>• Community Forum</li>
                                <li>• Training Resources</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-dark-600/50">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-dark-700/50 text-gray-300 rounded-xl hover:bg-dark-600/50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-xl hover:from-primary-600 hover:to-blue-700 transition-all duration-300"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SettingsModal; 