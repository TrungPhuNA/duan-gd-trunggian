const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Room = require('./Room');
const RoomMember = require('./RoomMember');
const Transaction = require('./Transaction');
const Dispute = require('./Dispute');
const DisputeEvidence = require('./DisputeEvidence');
const TransactionHistory = require('./TransactionHistory');
const Notification = require('./Notification');
const SystemSetting = require('./SystemSetting');

// Initialize models
const models = {
  User: User(sequelize),
  Room: Room(sequelize),
  RoomMember: RoomMember(sequelize),
  Transaction: Transaction(sequelize),
  Dispute: Dispute(sequelize),
  DisputeEvidence: DisputeEvidence(sequelize),
  TransactionHistory: TransactionHistory(sequelize),
  Notification: Notification(sequelize),
  SystemSetting: SystemSetting(sequelize)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
