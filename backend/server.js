import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import { testConnection, syncDatabase } from './config/database.js';
import { 
  errorHandler, 
  notFound, 
  handleUncaughtException, 
  handleUnhandledRejection 
} from './middlewares/errorHandler.js';
import { httpLogger, httpConsoleLogger, logger } from './middlewares/logger.js';

// Handle uncaught exceptions
handleUncaughtException();

// Initialize Express app
const app = express();
const port = config.port;

// Security Middleware
app.use(helmet()); // Security headers
app.use(cors(config.cors)); // CORS configuration

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(httpLogger); // File logging
if (config.nodeEnv === 'development') {
  app.use(httpConsoleLogger); // Console logging in development
}

// Static file serving (for uploaded files)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: 'PostgreSQL'
  });
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'College Placement Management Portal API',
    version: '1.0.0',
    database: 'PostgreSQL with Sequelize',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Import routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import driveRoutes from './routes/driveRoutes.js';
import hodRoutes from './routes/hodRoutes.js';
import tpoRoutes from './routes/tpoRoutes.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/tpo', tpoRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler (must be last)
app.use(errorHandler);

// Initialize Database and Start Server
const startServer = async () => {
  try {
    // Test database connection
    logger.info('🔌 Connecting to PostgreSQL database...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      logger.error('❌ Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Sync database models (only in development)
    if (config.nodeEnv === 'development') {
      logger.info('🔄 Syncing database models...');
      await syncDatabase(false, false); // Set to true to force sync (WARNING: drops tables)
    }

    // Start server
    const server = app.listen(port, () => {
      logger.info(`✅ Server listening at http://localhost:${port}`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`🗄️  Database: PostgreSQL (Sequelize)`);
      console.log(`\n✅ Server running on port ${port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`🗄️  Database: PostgreSQL\n`);
    });

    // Handle unhandled promise rejections
    handleUnhandledRejection(server);

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    console.error('❌ Server startup error:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
