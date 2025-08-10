import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Log from './models/Log.js';
import Alert from './models/Alert.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shadowhawk');
    
    // Clear existing data
    await User.deleteMany({});
    await Log.deleteMany({});
    await Alert.deleteMany({});
    
    // Create admin user
    const admin = new User({
      name: 'Administrator',
      email: 'admin@shadowhawk.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    await admin.save();
    
    // Create employee user
    const employee = new User({
      name: 'John Employee',
      email: 'user@shadowhawk.com',
      password: 'user123',
      role: 'employee',
      isActive: true
    });
    await employee.save();
    
    // Create sample logs with more recent data for better chart visualization
    const sampleLogs = [
      {
        user: 'Administrator',
        userId: admin._id,
        action: 'User Login',
        ip: '192.168.1.100',
        riskScore: 5,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      },
      {
        user: 'John Employee',
        userId: employee._id,
        action: 'File Download',
        ip: '192.168.1.101',
        riskScore: 25,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        user: 'John Employee',
        userId: employee._id,
        action: 'System Access',
        ip: '10.0.0.50',
        riskScore: 45,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        user: 'Administrator',
        userId: admin._id,
        action: 'Admin Action',
        ip: '192.168.1.100',
        riskScore: 30,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        user: 'John Employee',
        userId: employee._id,
        action: 'Data Export',
        ip: '192.168.1.101',
        riskScore: 60,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: 'Administrator',
        userId: admin._id,
        action: 'User Login',
        ip: '192.168.1.100',
        riskScore: 5,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        user: 'John Employee',
        userId: employee._id,
        action: 'File Upload',
        ip: '10.0.0.50',
        riskScore: 35,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        user: 'Administrator',
        userId: admin._id,
        action: 'System Access',
        ip: '192.168.1.100',
        riskScore: 15,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        user: 'John Employee',
        userId: employee._id,
        action: 'User Login',
        ip: '192.168.1.101',
        riskScore: 5,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        user: 'Administrator',
        userId: admin._id,
        action: 'Admin Action',
        ip: '192.168.1.100',
        riskScore: 25,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      }
    ];
    
    await Log.insertMany(sampleLogs);
    
    // Create sample alerts
    const sampleAlerts = [
      {
        user: 'John Employee',
        userId: employee._id,
        message: 'Suspicious file access detected',
        severity: 'high',
        details: {
          action: 'File Download',
          ip: '192.168.1.101',
          riskScore: 25
        },
        createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
      },
      {
        user: 'John Employee',
        userId: employee._id,
        message: 'High-risk activity from new IP address',
        severity: 'critical',
        details: {
          action: 'System Access',
          ip: '10.0.0.50',
          riskScore: 45
        },
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000)
      }
    ];
    
    await Alert.insertMany(sampleAlerts);
    
    console.log('✅ Sample data created successfully');
    console.log('Admin credentials: admin@shadowhawk.com / admin123');
    console.log('Employee credentials: user@shadowhawk.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();