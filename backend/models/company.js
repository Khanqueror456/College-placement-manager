import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Company = sequelize.define(
  'Company',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  // Lowercase to match actual table name in PostgreSQL
        key: 'id'
      }
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

export default Company;
