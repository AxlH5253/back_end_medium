'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_articles = sequelize.define('tbl_articles', {
    title: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    image: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    isPublished: DataTypes.BOOLEAN,
    isArchived: DataTypes.BOOLEAN
  }, {});
  
  tbl_articles.associate = function(models) {  
    tbl_articles.belongsTo(models.tbl_categories, {foreignKey : 'categoryId',as:'category'});
    tbl_articles.belongsTo(models.tbl_users, {foreignKey :'authorId',as:'createdBy'});
    
    tbl_articles.hasMany(
      models.tbl_comments, { foreignKey : 'articleId',as:'comments'}
    )

  };
  return tbl_articles;
};