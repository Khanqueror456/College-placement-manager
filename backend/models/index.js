// Re-export the main Sequelize instance from config/database.js
// This ensures all models use the same database connection
import sequelize from '../config/database.js';

export default sequelize;