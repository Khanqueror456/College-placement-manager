import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration (PostgreSQL with Sequelize)
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'college_placement_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: process.env.DB_DIALECT || 'postgres',
    storage: process.env.DB_STORAGE || './database.sqlite', // For SQLite
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d'
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    from: process.env.EMAIL_FROM || 'noreply@collegeplacement.com'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['.pdf', '.doc', '.docx']
  },

  // CORS Configuration
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // AI Configuration
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: process.env.AI_MODEL || 'gpt-4'
  },

  // User Roles
  roles: {
    STUDENT: 'student',
    HOD: 'hod',
    TPO: 'tpo'
  }
};

export default config;
