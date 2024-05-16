'use strict';
const { BOOLEAN } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Revenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //dinh danh cac moi quan he

      // Revenue.hasMany(models.Doctor_Infor, { foreignKey: 'RevenueId', as: 'doctorInfo' }); // tự làm

    }
  };
  Revenue.init({
    date: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    amount   : DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Revenue',
  });
  return Revenue;
};