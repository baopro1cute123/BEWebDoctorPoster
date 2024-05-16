'use strict';
const { BOOLEAN } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //dinh danh cac moi quan he

      History.belongsTo(models.User,{foreignKey:'patientId', targetKey: 'id', as: 'patientDataHistory'}) // them
      History.belongsTo(models.User,{foreignKey:'doctorId', targetKey: 'id', as: 'doctorDataHistory'}) // them


    }
  };
  History.init({
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    files : DataTypes.STRING,
    date : DataTypes.STRING,
    // price : DataTypes.DOUBLE
    
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};