import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import { logger } from '../middlewares/logger.js';

/**
 * Sequelize Database Connection
 */

let sequelize;

// Check if DATABASE_URL is provided (for hosted databases like Kinsta)
if (config.database.url) {
  sequelize = new Sequelize(config.database.url, {
    dialect: 'postgres',
    logging: config.database.logging,
    pool: config.database.pool,
    dialectOptions: {},  // No SSL for now
    define: {
      timestamps: true, // Adds createdAt and updatedAt
      underscored: true, // Use snake_case for column names
      freezeTableName: false, // Use plural table names
    }
  });
  logger.info('📦 Using DATABASE_URL for connection (SSL disabled)');
} else {
  // Use individual connection parameters
  sequelize = new Sequelize(
    config.database.name,
    config.database.username,
    config.database.password,
    {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      pool: config.database.pool,
      logging: config.database.logging,
      dialectOptions: config.database.dialectOptions,
      define: {
        timestamps: true, // Adds createdAt and updatedAt
        underscored: true, // Use snake_case for column names
        freezeTableName: false, // Use plural table names
      }
    }
  );
  logger.info('📦 Using individual DB parameters for connection');
}

/**
 * Test Database Connection
 */
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Unable to connect to database:', error);
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Sync Database Models
 * @param {boolean} force - Drop tables if they exist
 * @param {boolean} alter - Alter tables to match models
 */
export const syncDatabase = async (force = false, alter = false) => {
  try {
    if (force) {
      logger.warn('⚠️  Force sync enabled - All tables will be dropped!');
      await sequelize.sync({ force: true });
      logger.info('✅ Database force synced - All tables recreated');
    } else if (alter) {
      logger.info('🔄 Altering database tables...');
      await sequelize.sync({ alter: true });
      logger.info('✅ Database tables altered successfully');
    } else {
      await sequelize.sync();
      logger.info('✅ Database synced successfully');
    }
    return true;
  } catch (error) {
    logger.error('❌ Database sync failed:', error);
    console.error('❌ Database sync error:', error.message);
    return false;
  }
};

/**
 * Close Database Connection
 */
export const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
    return true;
  } catch (error) {
    logger.error('Error closing database connection:', error);
    return false;
  }
};

/**
 * Get Sequelize Instance
 */
export const getSequelize = () => sequelize;

/**
 * Database Health Check
 */
export const healthCheck = async () => {
  try {
    await sequelize.authenticate();
    return {
      status: 'healthy',
      database: 'PostgreSQL',
      connected: true
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: 'PostgreSQL',
      connected: false,
      error: error.message
    };
  }
};

export default sequelize;
