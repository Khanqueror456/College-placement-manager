import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Placement = sequelize.define(
  'Placement',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    package_ctc: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    eligible_departments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    minimum_cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 6.0,
    },
    eligible_batch_years: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    registration_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    registration_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    drive_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'DRAFT',
    },
    total_positions: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

const findOne = (...args) => Placement.findOne(...args);
const create = (...args) => Placement.create(...args);
const findAll = (...args) => Placement.findAll(...args);

export { findOne, create, findAll };
export default Placement;