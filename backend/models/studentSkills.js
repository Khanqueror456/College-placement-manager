import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentSkill = sequelize.define('StudentSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  skill_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  skill_category: {
    type: DataTypes.ENUM(
      'programming_language',
      'framework',
      'database',
      'cloud',
      'tool',
      'soft_skill',
      'other'
    ),
    defaultValue: 'other'
  },
  proficiency_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    defaultValue: 'intermediate'
  },
  extracted_from_resume: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'student_skills',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['student_id']
    },
    {
      fields: ['skill_name']
    },
    {
      fields: ['skill_category']
    }
  ]
});

export default StudentSkill;
