import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('STUDENT', 'HOD', 'TPO'),  // Removed ADMIN - TPO acts as admin
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    // Student specific fields
    student_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    batch_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    
    // Resume and ATS Score fields
    resume_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ats_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    ats_analysis: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    last_resume_update: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    
    // HOD specific fields
    employee_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    
    // Status fields
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    profile_status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'INCOMPLETE'),
      defaultValue: 'INCOMPLETE',
    },
  },
  {
    timestamps: true,
  }
);

const findOne = (...args) => User.findOne(...args);
const create = (...args) => User.create(...args);
const findAll = (...args) => User.findAll(...args);

export { findOne, create, findAll };
export default User;