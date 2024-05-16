'use strict';
const { BOOLEAN } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, {foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData'})
      User.belongsTo(models.Allcode, {foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData'})
      
      User.hasOne(models.Markdown, {foreignKey: 'doctorId'})
      User.hasOne(models.Doctor_Infor, {foreignKey: 'doctorId'})

      User.hasMany(models.Schedule, {foreignKey: 'doctorId',  as: 'doctorData'})

      User.hasMany(models.Booking, {foreignKey: 'patientId',  as: 'patientData'})

      User.hasMany(models.Booking, {foreignKey: 'doctorId',  as: 'doctorIdData'})


      User.hasMany(models.History, {foreignKey: 'patientId',  as: 'patientDataHistory'}) // them

      User.hasMany(models.History, {foreignKey: 'doctorId',  as: 'doctorDataHistory'}) // them



    }
  };
  User.init({
    email: DataTypes.STRING,
    password : DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address : DataTypes.STRING,
    phonenumber : DataTypes.STRING,
    gender : DataTypes.STRING,
    image : DataTypes.STRING,
    roleId : DataTypes.STRING,
    positionId : DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};