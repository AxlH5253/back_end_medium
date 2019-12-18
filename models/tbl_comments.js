'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_comments = sequelize.define('tbl_comments', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    isPublished: DataTypes.BOOLEAN,
    isArchived: DataTypes.BOOLEAN
  }, {});
  tbl_comments.associate = function(models) {
    // associations can be defined here
  };
  return tbl_comments;
};