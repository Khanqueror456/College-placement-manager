// Re-export the main Sequelize instance from config/database.js
// This ensures all models use the same database connection
import sequelize from '../config/database.js';
import User from './users.js';
import Company from './company.js';
import Drive from './drive.js';
import Application from './application.js';
import StudentSkill from './studentSkills.js';

// Define associations
Company.hasMany(Drive, { foreignKey: 'company_id', as: 'drives' });
Drive.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Drive.hasMany(Application, { foreignKey: 'drive_id', as: 'applications' });
Application.belongsTo(Drive, { foreignKey: 'drive_id', as: 'drive' });

User.hasMany(Application, { foreignKey: 'student_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

User.hasMany(Company, { foreignKey: 'added_by', as: 'companies_added' });
Company.belongsTo(User, { foreignKey: 'added_by', as: 'added_by_user' });

User.hasMany(Drive, { foreignKey: 'created_by', as: 'drives_created' });
Drive.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Student Skills associations
User.hasMany(StudentSkill, { foreignKey: 'student_id', as: 'skills' });
StudentSkill.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

export { User, Company, Drive, Application, StudentSkill };
export default sequelize;
