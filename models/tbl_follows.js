'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_follows = sequelize.define('tbl_follows', {
    userId: DataTypes.INTEGER,
    followingUserId: DataTypes.INTEGER
  }, {});
  tbl_follows.associate = function(models) {
    tbl_follows.belongsTo(models.tbl_users,{foreignKey:'followingUserId'});
  };
  return tbl_follows;
};