const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DisputeEvidence = sequelize.define('DisputeEvidence', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    disputeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'dispute_id'
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'file_name'
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'file_path'
    },
    fileType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'file_type'
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'file_size'
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'uploaded_by'
    }
  }, {
    tableName: 'dispute_evidence',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  // Associations
  DisputeEvidence.associate = (models) => {
    DisputeEvidence.belongsTo(models.Dispute, {
      foreignKey: 'dispute_id',
      as: 'dispute'
    });

    DisputeEvidence.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'uploader'
    });
  };

  return DisputeEvidence;
};
