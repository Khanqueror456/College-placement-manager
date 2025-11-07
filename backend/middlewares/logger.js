import winston from 'winston';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import config from '../config/config.js';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Winston Logger Configuration
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Winston logger instance
export const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'placement-portal' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write error logs to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Add console transport in development
if (config.nodeEnv === 'development') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

/**
 * Morgan HTTP Request Logger Middleware
 */
// Create a write stream for morgan
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Morgan token for user ID
morgan.token('user-id', (req) => {
  return req.user?.id || 'anonymous';
});

// Morgan token for user role
morgan.token('user-role', (req) => {
  return req.user?.role || 'guest';
});

// Custom morgan format
const morganFormat = config.nodeEnv === 'development'
  ? ':method :url :status :response-time ms - :res[content-length] - user: :user-id (:user-role)'
  : ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Morgan middleware
export const httpLogger = morgan(morganFormat, {
  stream: accessLogStream,
  skip: (req, res) => {
    // Skip logging for health check endpoints
    return req.url === '/health' || req.url === '/api/health';
  }
});

// Console logging in development
export const httpConsoleLogger = config.nodeEnv === 'development'
  ? morgan(morganFormat)
  : morgan('combined');

/**
 * Request Logger Middleware
 */
export const logRequest = (req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id,
    userRole: req.user?.role
  });
  next();
};

/**
 * Response Logger Middleware
 */
export const logResponse = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function (data) {
    logger.info('Outgoing response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      userId: req.user?.id
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Log Info
 */
export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

/**
 * Log Error
 */
export const logError = (message, error = {}) => {
  logger.error(message, {
    error: error.message,
    stack: error.stack,
    ...error
  });
};

/**
 * Log Warning
 */
export const logWarning = (message, meta = {}) => {
  logger.warn(message, meta);
};

/**
 * Log Debug
 */
export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

/**
 * Log Activity (for audit trail)
 */
export const logActivity = (action, userId, details = {}) => {
  logger.info('User activity', {
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

export default {
  logger,
  httpLogger,
  httpConsoleLogger,
  logRequest,
  logResponse,
  logInfo,
  logError,
  logWarning,
  logDebug,
  logActivity
};
