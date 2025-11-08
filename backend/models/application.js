import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Application = sequelize.define(
  'Application',
  {
    drive_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'drives',  // Lowercase to match actual table name
        key: 'id'
      }
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  // Lowercase to match actual table name
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'ON_HOLD', 'WITHDRAWN'),
      defaultValue: 'APPLIED',
    },
    current_round: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    offer_letter_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    offer_letter_uploaded_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    applied_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

export default Application;
