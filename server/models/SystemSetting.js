const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SystemSetting = sequelize.define('SystemSetting', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    settingKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'setting_key'
    },
    settingValue: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'setting_value'
    },
    description: {
      type: DataTypes.TEXT
    },
    updatedBy: {
      type: DataTypes.UUID,
      field: 'updated_by'
    }
  }, {
    tableName: 'system_settings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Class methods
  SystemSetting.getValue = async function(key, defaultValue = null) {
    const setting = await this.findOne({ where: { settingKey: key } });
    return setting ? setting.settingValue : defaultValue;
  };

  SystemSetting.setValue = async function(key, value, updatedBy = null) {
    const [setting, created] = await this.findOrCreate({
      where: { settingKey: key },
      defaults: { settingValue: value, updatedBy }
    });

    if (!created) {
      setting.settingValue = value;
      setting.updatedBy = updatedBy;
      await setting.save();
    }

    return setting;
  };

  SystemSetting.getMultiple = async function(keys) {
    const settings = await this.findAll({
      where: { settingKey: keys }
    });

    const result = {};
    settings.forEach(setting => {
      result[setting.settingKey] = setting.settingValue;
    });

    return result;
  };

  // Associations
  SystemSetting.associate = (models) => {
    SystemSetting.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updatedByUser'
    });
  };

  return SystemSetting;
};
