import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const PlacementRegistration = sequelize.define(
  'PlacementRegistration',
  {
    placement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('REGISTERED', 'SHORTLISTED', 'REJECTED', 'SELECTED', 'WITHDRAWN'),
      defaultValue: 'REGISTERED',
    },
    current_round: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    final_result: {
      type: DataTypes.ENUM('PENDING', 'SELECTED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    selection_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    offer_letter_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    offered_package: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['placement_id', 'student_id']
      }
    ]
  }
);

const findOne = (...args) => PlacementRegistration.findOne(...args);
const create = (...args) => PlacementRegistration.create(...args);
const findAll = (...args) => PlacementRegistration.findAll(...args);

export { findOne, create, findAll };
export default PlacementRegistration;