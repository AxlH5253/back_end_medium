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
    tbl_comments.belongsTo(models.tbl_articles, {foreignKey : 'articleId'});
  };
  return tbl_comments;
};