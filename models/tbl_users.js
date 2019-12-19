'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_users = sequelize.define('tbl_users', {
    fullname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  tbl_users.associate = function(models) {
    tbl_users.hasMany(
      models.tbl_articles, {foreignKey : 'authorId'}
    )
    tbl_users.hasMany(
      models.tbl_follows,{foreignKey:'followingUserId'}
    )
  };
  return tbl_users;
};