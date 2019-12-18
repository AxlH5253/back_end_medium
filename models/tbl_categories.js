'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_categories = sequelize.define('tbl_categories', {
    name: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN,
    isArchived: DataTypes.BOOLEAN
  }, {});
  
  tbl_categories.associate = function(models) {
  
  };
  return tbl_categories;
};