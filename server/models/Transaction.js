const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'buyer_id'
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'seller_id'
    },
    roomId: {
      type: DataTypes.UUID,
      field: 'room_id'
    },
    productName: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'product_name',
      validate: {
        notEmpty: true,
        len: [1, 500]
      }
    },
    productDescription: {
      type: DataTypes.TEXT,
      field: 'product_description'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    feePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 2.00,
      field: 'fee_percentage',
      validate: {
        min: 0,
        max: 100
      }
    },
    feeAmount: {
      type: DataTypes.VIRTUAL,
      get() {
        return (this.amount * this.feePercentage / 100).toFixed(2);
      }
    },
    sellerAmount: {
      type: DataTypes.VIRTUAL,
      get() {
        return (this.amount - this.feeAmount).toFixed(2);
      }
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING_SELLER',
        'PENDING_PAYMENT',
        'PAID',
        'SHIPPING',
        'COMPLETED',
        'DISPUTED',
        'CANCELLED',
        'REFUNDED'
      ),
      allowNull: false,
      defaultValue: 'PENDING_SELLER'
    },
    notes: {
      type: DataTypes.TEXT
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      field: 'payment_method'
    },
    paymentReference: {
      type: DataTypes.STRING(255),
      field: 'payment_reference'
    },
    shippingInfo: {
      type: DataTypes.JSON,
      field: 'shipping_info'
    },
    completedAt: {
      type: DataTypes.DATE,
      field: 'completed_at'
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      afterUpdate: async (transaction, options) => {
        // Create transaction history entry
        if (transaction.changed('status')) {
          const TransactionHistory = sequelize.models.TransactionHistory;
          await TransactionHistory.create({
            transactionId: transaction.id,
            statusFrom: transaction._previousDataValues.status,
            statusTo: transaction.status,
            changedBy: options.userId || null,
            notes: options.notes || null
          });
        }

        // Update completed_at when status changes to COMPLETED
        if (transaction.status === 'COMPLETED' && !transaction.completedAt) {
          transaction.completedAt = new Date();
          await transaction.save({ hooks: false });
        }
      }
    }
  });

  // Instance methods
  Transaction.prototype.canBeUpdatedBy = function(userId, userRole) {
    if (userRole === 'admin') return true;
    
    switch (this.status) {
      case 'PENDING_SELLER':
        return this.sellerId === userId;
      case 'PENDING_PAYMENT':
        return this.buyerId === userId;
      case 'PAID':
        return this.sellerId === userId;
      case 'SHIPPING':
        return this.buyerId === userId;
      default:
        return false;
    }
  };

  Transaction.prototype.getNextValidStatuses = function(userRole) {
    const statusMap = {
      'PENDING_SELLER': ['PENDING_PAYMENT', 'CANCELLED'],
      'PENDING_PAYMENT': ['PAID', 'CANCELLED'],
      'PAID': ['SHIPPING', 'DISPUTED'],
      'SHIPPING': ['COMPLETED', 'DISPUTED'],
      'COMPLETED': [],
      'DISPUTED': userRole === 'admin' ? ['COMPLETED', 'REFUNDED'] : [],
      'CANCELLED': [],
      'REFUNDED': []
    };

    return statusMap[this.status] || [];
  };

  Transaction.prototype.calculateAmounts = function() {
    const fee = parseFloat((this.amount * this.feePercentage / 100).toFixed(2));
    const sellerAmount = parseFloat((this.amount - fee).toFixed(2));
    
    return {
      amount: parseFloat(this.amount),
      feeAmount: fee,
      sellerAmount: sellerAmount,
      feePercentage: parseFloat(this.feePercentage)
    };
  };

  // Class methods
  Transaction.findByUser = function(userId, role = null) {
    const where = {};
    
    if (role === 'buyer') {
      where.buyerId = userId;
    } else if (role === 'seller') {
      where.sellerId = userId;
    } else {
      where[sequelize.Op.or] = [
        { buyerId: userId },
        { sellerId: userId }
      ];
    }

    return this.findAll({
      where,
      include: [
        { model: sequelize.models.User, as: 'buyer', attributes: ['id', 'name', 'phone'] },
        { model: sequelize.models.User, as: 'seller', attributes: ['id', 'name', 'phone'] },
        { model: sequelize.models.Room, as: 'room', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
  };

  Transaction.getStatistics = async function(startDate = null, endDate = null) {
    const where = {};
    
    if (startDate && endDate) {
      where.created_at = {
        [sequelize.Op.between]: [startDate, endDate]
      };
    }

    const stats = await this.findAll({
      where,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('SUM', sequelize.literal('amount * fee_percentage / 100')), 'totalFees'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'COMPLETED' THEN 1 END")), 'completedTransactions'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'DISPUTED' THEN 1 END")), 'disputedTransactions']
      ],
      raw: true
    });

    return stats[0];
  };

  // Associations
  Transaction.associate = (models) => {
    // Transaction belongs to buyer
    Transaction.belongsTo(models.User, {
      foreignKey: 'buyer_id',
      as: 'buyer'
    });

    // Transaction belongs to seller
    Transaction.belongsTo(models.User, {
      foreignKey: 'seller_id',
      as: 'seller'
    });

    // Transaction belongs to room (optional)
    Transaction.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room'
    });

    // Transaction has one dispute
    Transaction.hasOne(models.Dispute, {
      foreignKey: 'transaction_id',
      as: 'dispute'
    });

    // Transaction has many history entries
    Transaction.hasMany(models.TransactionHistory, {
      foreignKey: 'transaction_id',
      as: 'history'
    });
  };

  return Transaction;
};
