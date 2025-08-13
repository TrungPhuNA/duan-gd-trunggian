const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Room = sequelize.define('Room', {
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
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.ENUM('electronics', 'fashion', 'home', 'books', 'sports', 'other'),
      allowNull: false
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'owner_id'
    },
    rules: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'member_count'
    },
    transactionCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'transaction_count'
    }
  }, {
    tableName: 'rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Instance methods
  Room.prototype.canBeModifiedBy = function(userId) {
    return this.ownerId === userId;
  };

  Room.prototype.addMember = async function(userId) {
    const RoomMember = sequelize.models.RoomMember;
    
    // Check if already a member
    const existingMember = await RoomMember.findOne({
      where: { roomId: this.id, userId }
    });
    
    if (existingMember) {
      throw new Error('User is already a member of this room');
    }

    // Add member
    await RoomMember.create({
      roomId: this.id,
      userId
    });

    // Update member count
    await this.increment('memberCount');
  };

  Room.prototype.removeMember = async function(userId) {
    const RoomMember = sequelize.models.RoomMember;
    
    const deleted = await RoomMember.destroy({
      where: { roomId: this.id, userId }
    });

    if (deleted > 0) {
      await this.decrement('memberCount');
    }

    return deleted > 0;
  };

  Room.prototype.isMember = async function(userId) {
    const RoomMember = sequelize.models.RoomMember;
    
    const member = await RoomMember.findOne({
      where: { roomId: this.id, userId }
    });

    return !!member;
  };

  // Class methods
  Room.findByCategory = function(category) {
    return this.findAll({
      where: { category, status: 'active' },
      include: [
        { model: sequelize.models.User, as: 'owner', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
  };

  Room.findByOwner = function(ownerId) {
    return this.findAll({
      where: { ownerId },
      include: [
        { model: sequelize.models.User, as: 'owner', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
  };

  Room.getPopularRooms = function(limit = 10) {
    return this.findAll({
      where: { status: 'active' },
      include: [
        { model: sequelize.models.User, as: 'owner', attributes: ['id', 'name'] }
      ],
      order: [['memberCount', 'DESC'], ['transactionCount', 'DESC']],
      limit
    });
  };

  // Associations
  Room.associate = (models) => {
    // Room belongs to owner
    Room.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner'
    });

    // Room has many members
    Room.belongsToMany(models.User, {
      through: models.RoomMember,
      foreignKey: 'room_id',
      as: 'members'
    });

    // Room has many transactions
    Room.hasMany(models.Transaction, {
      foreignKey: 'room_id',
      as: 'transactions'
    });
  };

  return Room;
};
