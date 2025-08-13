const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TransactionHistory = sequelize.define('TransactionHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'transaction_id'
    },
    statusFrom: {
      type: DataTypes.STRING(50),
      field: 'status_from'
    },
    statusTo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'status_to'
    },
    changedBy: {
      type: DataTypes.UUID,
      field: 'changed_by'
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'transaction_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  // Associations
  TransactionHistory.associate = (models) => {
    TransactionHistory.belongsTo(models.Transaction, {
      foreignKey: 'transaction_id',
      as: 'transaction'
    });

    TransactionHistory.belongsTo(models.User, {
      foreignKey: 'changed_by',
      as: 'changedByUser'
    });
  };

  return TransactionHistory;
};
