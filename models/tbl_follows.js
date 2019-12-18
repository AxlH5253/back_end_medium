'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_follows = sequelize.define('tbl_follows', {
    userId: DataTypes.INTEGER,
    followingUserId: DataTypes.INTEGER
  }, {});
  tbl_follows.associate = function(models) {
    // associations can be defined here
  };
  return tbl_follows;
};