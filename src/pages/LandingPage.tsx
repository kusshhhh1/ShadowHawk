import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Brain, 
  Zap, 
  BarChart3, 
  Users, 
  Lock,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Star particle component
const StarParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full opacity-60"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0], 
      scale: [0, 1, 0],
      y: [-20, -100],
      x: [0, Math.random() * 100 - 50]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

// Animated card component
const AnimatedCard = ({ children, delay = 0, className = "" }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) => (
  <motion.div
    className={`bg-dark-800/50 backdrop-blur-md border border-dark-600/50 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20 ${className}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true, margin: "-100px" }}
    whileHover={{ 
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
    }}
  >
    {children}
  </motion.div>
);

// Fade in section component
const FadeInSection = ({ children, delay = 0 }: { 
  children: React.ReactNode; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true, margin: "-100px" }}
  >
    {children}
  </motion.div>
);

function LandingPage() {
  const { scrollY } = useScroll();
  const navbarY = useTransform(scrollY, [0, 100], [0, -100]);
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Eye,
      title: 'Real-time Monitoring',
      description: 'Advanced behavioral analysis with AI-powered threat detection in real-time.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI Risk Scoring',
      description: 'Machine learning algorithms that adapt and improve threat detection accuracy.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Multi-channel notifications with intelligent escalation protocols.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with predictive insights and trend analysis.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Detection Accuracy' },
    { number: '< 50ms', label: 'Response Time' },
    { number: '24/7', label: 'Monitoring' },
    { number: '1000+', label: 'Enterprise Clients' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1126] via-[#0a0f1d] to-[#060b23] overflow-x-hidden">
      {/* Star particles background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <StarParticle key={i} delay={i * 0.1} />
        ))}
      </div>

      {/* Enhanced Navigation with Auto-hide */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-dark-800/80 border-b border-dark-600/30"
        style={{ y: navbarY, opacity: navbarOpacity }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <Shield className="h-8 w-8 text-primary-500" />
              <motion.div
                className="absolute inset-0 bg-primary-500 rounded-full opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ShadowHawk
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/login" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-lg hover:from-primary-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Full-screen Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="text-7xl md:text-8xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Enterprise
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-400 to-cyan-400">
                Threat Detection
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Protect your organization with AI-powered insider threat detection. 
              Real-time monitoring, behavioral analysis, and predictive security.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/signup"
                className="group px-10 py-4 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 animate-pulse-glow flex items-center space-x-3"
              >
                <span>Try Demo</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="px-10 py-4 border-2 border-primary-500 text-primary-500 rounded-xl font-semibold text-lg hover:bg-primary-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating elements with mouse interaction */}
          <motion.div 
            className="absolute top-20 left-10 w-24 h-24 border border-primary-500/30 rounded-full"
            animate={{ 
              x: mousePosition.x * 0.01,
              y: mousePosition.y * 0.01 
            }}
            transition={{ type: "spring", stiffness: 50 }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-20 h-20 bg-primary-500/20 rounded-lg"
            animate={{ 
              x: -mousePosition.x * 0.01,
              y: -mousePosition.y * 0.01 
            }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </section>

      {/* Stats Section */}
      <FadeInSection>
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* SVG Wave Divider */}
      <div className="relative">
        <svg className="w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-dark-800"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.26,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-dark-700"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-dark-600"
          />
        </svg>
      </div>

      {/* Features Section */}
      <section className="px-6 py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-white mb-6">
                Advanced Security Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive threat detection powered by cutting-edge AI and machine learning
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedCard key={feature.title} delay={index * 0.1}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Secure Your Enterprise?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of organizations protecting their data with ShadowHawk's advanced threat detection
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div 
                className="flex items-center justify-center space-x-3 text-gray-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg">Real-time Protection</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-3 text-gray-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg">AI-Powered Detection</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-3 text-gray-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg">Enterprise-Grade Security</span>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link 
                to="/signup"
                className="group px-10 py-4 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 animate-pulse-glow flex items-center justify-center space-x-3"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="px-10 py-4 border-2 border-primary-500 text-primary-500 rounded-xl font-semibold text-lg hover:bg-primary-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Login Now
              </Link>
            </motion.div>
          </FadeInSection>
        </div>
      </section>

      {/* Enhanced Footer */}
      <motion.footer 
        className="border-t border-dark-600 px-6 py-12 bg-dark-900/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <motion.div 
                className="flex items-center space-x-3 mb-4"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Shield className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-bold text-white">ShadowHawk</span>
              </motion.div>
              <p className="text-gray-400 mb-4">
                Enterprise-grade insider threat detection powered by AI and machine learning.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  <AlertTriangle className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-dark-600 pt-8 text-center">
            <p className="text-gray-400">
              🔐 Built with ❤️ by <span className="text-primary-500">Kushagra</span>
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default LandingPage;
