const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dispute = sequelize.define('Dispute', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'transaction_id'
    },
    complainantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'complainant_id'
    },
    respondentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'respondent_id'
    },
    type: {
      type: DataTypes.ENUM('not_received', 'wrong_item', 'damaged', 'fake', 'other'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 500]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [20, 5000]
      }
    },
    resolutionRequest: {
      type: DataTypes.ENUM('refund', 'exchange', 'partial_refund', 'other'),
      allowNull: false,
      field: 'resolution_request'
    },
    status: {
      type: DataTypes.ENUM('pending', 'investigating', 'resolved', 'rejected'),
      defaultValue: 'pending'
    },
    adminId: {
      type: DataTypes.UUID,
      field: 'admin_id'
    },
    adminResponse: {
      type: DataTypes.TEXT,
      field: 'admin_response'
    },
    winner: {
      type: DataTypes.ENUM('buyer', 'seller')
    },
    resolvedAt: {
      type: DataTypes.DATE,
      field: 'resolved_at'
    }
  }, {
    tableName: 'disputes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      afterUpdate: async (dispute, options) => {
        // Update resolved_at when status changes to resolved
        if (dispute.status === 'resolved' && !dispute.resolvedAt) {
          dispute.resolvedAt = new Date();
          await dispute.save({ hooks: false });
        }

        // Update transaction status when dispute is resolved
        if (dispute.changed('status') && ['resolved', 'rejected'].includes(dispute.status)) {
          const Transaction = sequelize.models.Transaction;
          const transaction = await Transaction.findByPk(dispute.transactionId);
          
          if (transaction && transaction.status === 'DISPUTED') {
            let newStatus = 'COMPLETED';
            
            if (dispute.status === 'resolved' && dispute.winner === 'buyer') {
              newStatus = 'REFUNDED';
            }
            
            await transaction.update({ status: newStatus }, { userId: dispute.adminId });
          }
        }
      }
    }
  });

  // Instance methods
  Dispute.prototype.canBeViewedBy = function(userId, userRole) {
    if (userRole === 'admin') return true;
    return this.complainantId === userId || this.respondentId === userId;
  };

  Dispute.prototype.canBeModifiedBy = function(userId, userRole) {
    if (userRole === 'admin') return true;
    
    // Only complainant can modify pending disputes
    if (this.status === 'pending' && this.complainantId === userId) {
      return true;
    }
    
    return false;
  };

  Dispute.prototype.assignToAdmin = async function(adminId) {
    this.adminId = adminId;
    this.status = 'investigating';
    await this.save();
  };

  Dispute.prototype.resolve = async function(winner, adminResponse, adminId) {
    this.winner = winner;
    this.adminResponse = adminResponse;
    this.adminId = adminId;
    this.status = 'resolved';
    this.resolvedAt = new Date();
    await this.save();
  };

  Dispute.prototype.reject = async function(adminResponse, adminId) {
    this.adminResponse = adminResponse;
    this.adminId = adminId;
    this.status = 'rejected';
    await this.save();
  };

  Dispute.prototype.getPriority = function() {
    // Calculate priority based on transaction amount and dispute age
    const Transaction = sequelize.models.Transaction;
    
    return Transaction.findByPk(this.transactionId).then(transaction => {
      if (!transaction) return 'low';
      
      const amount = parseFloat(transaction.amount);
      const ageInDays = (new Date() - this.createdAt) / (1000 * 60 * 60 * 24);
      
      if (amount >= 50000000 || ageInDays >= 7) return 'high';
      if (amount >= 20000000 || ageInDays >= 3) return 'medium';
      return 'low';
    });
  };

  // Class methods
  Dispute.findByUser = function(userId, role = null) {
    const where = {};
    
    if (role === 'complainant') {
      where.complainantId = userId;
    } else if (role === 'respondent') {
      where.respondentId = userId;
    } else {
      where[sequelize.Op.or] = [
        { complainantId: userId },
        { respondentId: userId }
      ];
    }

    return this.findAll({
      where,
      include: [
        { model: sequelize.models.Transaction, as: 'transaction' },
        { model: sequelize.models.User, as: 'complainant', attributes: ['id', 'name', 'phone'] },
        { model: sequelize.models.User, as: 'respondent', attributes: ['id', 'name', 'phone'] },
        { model: sequelize.models.User, as: 'admin', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
  };

  Dispute.findPending = function() {
    return this.findAll({
      where: { status: 'pending' },
      include: [
        { model: sequelize.models.Transaction, as: 'transaction' },
        { model: sequelize.models.User, as: 'complainant', attributes: ['id', 'name', 'phone'] },
        { model: sequelize.models.User, as: 'respondent', attributes: ['id', 'name', 'phone'] }
      ],
      order: [['created_at', 'ASC']]
    });
  };

  Dispute.getStatistics = async function() {
    const stats = await this.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalDisputes'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'pending' THEN 1 END")), 'pendingDisputes'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'investigating' THEN 1 END")), 'investigatingDisputes'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'resolved' THEN 1 END")), 'resolvedDisputes'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'rejected' THEN 1 END")), 'rejectedDisputes']
      ],
      raw: true
    });

    return stats[0];
  };

  // Associations
  Dispute.associate = (models) => {
    // Dispute belongs to transaction
    Dispute.belongsTo(models.Transaction, {
      foreignKey: 'transaction_id',
      as: 'transaction'
    });

    // Dispute belongs to complainant
    Dispute.belongsTo(models.User, {
      foreignKey: 'complainant_id',
      as: 'complainant'
    });

    // Dispute belongs to respondent
    Dispute.belongsTo(models.User, {
      foreignKey: 'respondent_id',
      as: 'respondent'
    });

    // Dispute belongs to admin
    Dispute.belongsTo(models.User, {
      foreignKey: 'admin_id',
      as: 'admin'
    });

    // Dispute has many evidence files
    Dispute.hasMany(models.DisputeEvidence, {
      foreignKey: 'dispute_id',
      as: 'evidence'
    });
  };

  return Dispute;
};
