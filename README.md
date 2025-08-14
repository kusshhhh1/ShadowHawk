# 🛡️ ShadowHawk - Enterprise Insider Threat Detection System

An enterprise-grade insider threat detection system built with React, Node.js, and MongoDB. ShadowHawk uses AI-powered risk scoring to identify, monitor, and respond to potential insider threats in real-time.

![ShadowHawk Dashboard](https://images.pexels.com/photos/5474295/pexels-photo-5474295.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Admin/Employee)
- Secure password hashing with bcrypt
- Session management and automatic logout

### 📊 Real-Time Dashboard
- Live activity monitoring with Socket.io
- Interactive charts showing risk trends
- Threat distribution analytics
- Real-time alerts and notifications

### 🤖 AI-Powered Risk Scoring
- Behavioral analysis based on user patterns
- Time-based risk assessment (after hours, weekends)
- IP address anomaly detection
- Frequency analysis for suspicious activities
- Automatic alert generation for high-risk activities

### 📋 Comprehensive Logging
- Detailed activity logs with risk scores
- Advanced filtering and search capabilities
- Export functionality for compliance
- Real-time log streaming

### 🚨 Alert Management
- Severity-based alert classification
- Alert resolution tracking
- Detailed threat context and user history
- Real-time alert notifications

### 👥 User Management (Admin)
- User account administration
- Role assignment and permissions
- Account suspension/activation
- User activity oversight

### 🎨 Modern UI/UX
- Dark theme with stunning gradients
- Smooth animations with Framer Motion
- Responsive design for all devices
- Interactive data visualizations
- Micro-interactions and hover effects

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern component architecture
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Chart.js & React Chart.js 2** - Data visualization
- **Socket.io Client** - Real-time communication
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and static files
- **Environment-based configuration**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (or use Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/shadowhawk.git
cd shadowhawk
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install
```

### 3. Environment Setup
Create a `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shadowhawk
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 4. Start with Docker (Recommended)
```bash
docker-compose up -d
```

### 5. Or Start Manually
```bash
# Start MongoDB (if not using Docker)
mongod

# Start backend
cd server && npm run dev

# Start frontend (in another terminal)
npm run dev
```

### 6. Seed Sample Data
```bash
cd server && node seedData.js
```

## 📱 Demo Credentials

After seeding the database, use these credentials:

**Admin Account:**
- Email: `admin@shadowhawk.com`
- Password: `admin123`

**Employee Account:**
- Email: `user@shadowhawk.com`
- Password: `user123`

## 🔍 Risk Scoring Algorithm

ShadowHawk uses a sophisticated risk scoring system:

### Base Risk Factors
- **Action Type**: Different activities have base risk scores
- **Time Analysis**: Higher risk for after-hours access (10 PM - 6 AM)
- **Weekend Activity**: Increased risk for weekend access
- **IP Address**: New or unusual IP addresses trigger alerts
- **Frequency**: Rapid successive actions indicate potential threats
- **File Operations**: Large downloads/uploads receive higher scores

### Severity Levels
- **Low Risk** (0-14): Normal activity
- **Medium Risk** (15-29): Requires monitoring
- **High Risk** (30-49): Generates alerts
- **Critical Risk** (50+): Immediate intervention required

## 📊 Dashboard Features

### Analytics Cards
- Total Users
- Active Alerts  
- Suspicious Users
- Total Logs

### Interactive Charts
- Risk Score Trends (Line Chart)
- Threat Distribution (Doughnut Chart)
- Real-time Activity Feed

### Real-Time Updates
- Live log streaming
- Instant alert notifications
- Dashboard auto-refresh

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users (Admin Only)
- `GET /api/users` - Get all users
- `PATCH /api/users/:id/status` - Update user status
- `PATCH /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Logs
- `GET /api/logs` - Get activity logs
- `POST /api/logs` - Create log entry

### Alerts
- `GET /api/alerts` - Get security alerts
- `PATCH /api/alerts/:id/resolve` - Resolve alert

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🐳 Docker Deployment

The application includes Docker configuration for easy deployment:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services included:
- **MongoDB**: Database
- **Backend**: Express API server
- **Frontend**: Nginx serving React app
- **Reverse Proxy**: Nginx handling routing

## 🔒 Security Features

- **HTTP-Only Cookies**: Secure token storage
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **Role-Based Access**: Route protection
- **Rate Limiting**: API protection (configurable)

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Dark Theme**: Custom gradients (#0a0f1d to #101926)
- **Threat Colors**: 
  - Low: Green (#10b981)
  - Medium: Yellow (#f59e0b)  
  - High: Orange (#ef4444)
  - Critical: Red (#dc2626)

### Typography
- **Font System**: System fonts with fallbacks
- **Weights**: Light (300), Normal (400), Medium (500), Semibold (600), Bold (700)
- **Line Heights**: 120% for headings, 150% for body text

### Spacing
- **8px Grid System**: Consistent spacing throughout
- **Responsive Breakpoints**: Mobile-first approach

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Contributors

**Made with ❤️ by: Kushagra Sharma**


## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Socket.io](https://socket.io/) - Real-time communication

## 📞 Support

For support, email support@shadowhawk.com or create an issue on GitHub.

---

**⚡ Built for the future of cybersecurity**
