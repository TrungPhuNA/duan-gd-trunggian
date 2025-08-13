const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data: {
      type: DataTypes.JSON
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read'
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  // Instance methods
  Notification.prototype.markAsRead = async function() {
    this.isRead = true;
    await this.save();
  };

  // Class methods
  Notification.createForUser = async function(userId, type, title, message, data = null) {
    return this.create({
      userId,
      type,
      title,
      message,
      data
    });
  };

  Notification.markAllAsRead = async function(userId) {
    return this.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
  };

  // Associations
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Notification;
};
