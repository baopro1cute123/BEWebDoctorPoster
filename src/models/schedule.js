'use strict';
const { BOOLEAN } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //dinh danh cac moi quan he
      Schedule.belongsTo(models.Allcode, {foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData'})
      
      Schedule.belongsTo(models.User,{foreignKey:'doctorId', targetKey: 'id', as: 'doctorData'})

    }
  };
  Schedule.init({
    currentNumber: DataTypes.INTEGER,
    maxNumber: DataTypes.INTEGER,
    doctorId : DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType : DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};