const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RoomMember = sequelize.define('RoomMember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'room_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'joined_at'
    }
  }, {
    tableName: 'room_members',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['room_id', 'user_id']
      }
    ]
  });

  // Associations
  RoomMember.associate = (models) => {
    RoomMember.belongsTo(models.Room, {
      foreignKey: 'room_id'
    });

    RoomMember.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };

  return RoomMember;
};
