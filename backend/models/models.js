import sequelize from './index.js';
import User from './user.js';
import Placement from './placement.js';
import PlacementRegistration from './placementRegistration.js';

// Define associations
User.hasMany(Placement, {
  foreignKey: 'created_by',
  as: 'createdPlacements'
});

User.hasMany(PlacementRegistration, {
  foreignKey: 'student_id',
  as: 'registrations'
});

Placement.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

Placement.hasMany(PlacementRegistration, {
  foreignKey: 'placement_id',
  as: 'registrations'
});

PlacementRegistration.belongsTo(User, {
  foreignKey: 'student_id',
  as: 'student'
});

PlacementRegistration.belongsTo(Placement, {
  foreignKey: 'placement_id',
  as: 'placement'
});

// Sync database function
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    throw error;
  }
};

export {
  sequelize,
  User,
  Placement,
  PlacementRegistration,
  syncDatabase
};