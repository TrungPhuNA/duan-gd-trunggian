const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[0-9+\-\s()]+$/
      }
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    role: {
      type: DataTypes.ENUM('buyer', 'seller', 'admin'),
      allowNull: false,
      defaultValue: 'buyer'
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      field: 'avatar_url'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      field: 'last_login_at'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          const salt = await bcrypt.genSalt(12);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(12);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  };

  User.prototype.updateLastLogin = async function() {
    this.lastLoginAt = new Date();
    await this.save();
  };

  // Class methods
  User.findByPhone = function(phone) {
    return this.findOne({ where: { phone } });
  };

  User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  // Associations
  User.associate = (models) => {
    // User owns rooms
    User.hasMany(models.Room, {
      foreignKey: 'owner_id',
      as: 'ownedRooms'
    });

    // User can be member of many rooms
    User.belongsToMany(models.Room, {
      through: models.RoomMember,
      foreignKey: 'user_id',
      as: 'joinedRooms'
    });

    // User transactions as buyer
    User.hasMany(models.Transaction, {
      foreignKey: 'buyer_id',
      as: 'purchaseTransactions'
    });

    // User transactions as seller
    User.hasMany(models.Transaction, {
      foreignKey: 'seller_id',
      as: 'saleTransactions'
    });

    // User disputes as complainant
    User.hasMany(models.Dispute, {
      foreignKey: 'complainant_id',
      as: 'filedDisputes'
    });

    // User disputes as respondent
    User.hasMany(models.Dispute, {
      foreignKey: 'respondent_id',
      as: 'receivedDisputes'
    });

    // User disputes as admin
    User.hasMany(models.Dispute, {
      foreignKey: 'admin_id',
      as: 'handledDisputes'
    });

    // User notifications
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications'
    });

    // User transaction history
    User.hasMany(models.TransactionHistory, {
      foreignKey: 'changed_by',
      as: 'transactionChanges'
    });

    // User system settings updates
    User.hasMany(models.SystemSetting, {
      foreignKey: 'updated_by',
      as: 'systemSettingUpdates'
    });
  };

  return User;
};
