import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to server');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from server');
      });

      newSocket.on('new-alert', (alert) => {
        // Enhanced toast notification with better styling
        toast.error(
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🚨</span>
              <span className="font-semibold text-white">New Alert</span>
            </div>
            <div className="text-sm text-gray-300">
              {alert.message}
            </div>
            {alert.user && (
              <div className="text-xs text-gray-400">
                User: {alert.user}
              </div>
            )}
            {alert.severity && (
              <div className={`text-xs px-2 py-1 rounded inline-block ${
                alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {alert.severity.toUpperCase()}
              </div>
            )}
          </div>,
          {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            style: {
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            },
            toastId: `alert-${alert.id || Date.now()}`, // Prevent duplicate toasts
          }
        );

        // Optional: Add sound/vibration for critical alerts
        if (alert.severity === 'critical') {
          // Vibration API (if supported)
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        }
      });

      newSocket.on('new-log', (log) => {
        // Show toast for high-risk activities
        if (log.riskScore >= 30) {
          toast.warning(
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚠️</span>
                <span className="font-semibold text-white">High-Risk Activity</span>
              </div>
              <div className="text-sm text-gray-300">
                {log.action} by {log.user}
              </div>
              <div className="text-xs text-gray-400">
                Risk Score: {log.riskScore}
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              style: {
                background: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              },
              toastId: `log-${log.id || Date.now()}`,
            }
          );
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}