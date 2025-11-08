import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Drive = sequelize.define(
  'Drive',
  {
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',  // Lowercase to match actual table name
        key: 'id'
      }
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    job_type: {
      type: DataTypes.ENUM('FULL_TIME', 'INTERNSHIP', 'BOTH'),
      defaultValue: 'FULL_TIME',
    },
    package: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Eligibility Criteria
    min_cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 6.0,
    },
    allowed_departments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    max_backlogs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    graduation_years: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    // Important Dates
    application_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    drive_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Status
    status: {
      type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED'),
      defaultValue: 'DRAFT',
    },
    // Rounds tracking
    current_round: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_rounds: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    // Metadata
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  // Lowercase to match actual table name
        key: 'id'
      }
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',  // Lowercase to match actual table name
        key: 'id'
      }
    },
  },
  {
    timestamps: true,
  }
);

export default Drive;
