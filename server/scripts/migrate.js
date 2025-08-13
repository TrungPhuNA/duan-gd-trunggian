const { sequelize } = require('../config/database');
const models = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database models synchronized.');
    
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
