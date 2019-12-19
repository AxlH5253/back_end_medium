'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_comments', [
      {
        userId: 2,
        articleId: 4,
        comment: 'ternyata jelek'
      }
    ], {});
  },

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_users', [
      {
        fullname: 'Axl Hanuebi',
        username: 'axlh',
        email: 'axl@gmail.com',
        password:'12345678',
      }
    ], {});
  },

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_articles', [
      {
        title: 'Game Sepak Bola',
        content: 'Game sepak bola adalah PES dari Konami dan FIFA dari Electronic Arts',
        image: 'gambar1.jpg',
        authorId:1,
        categoryId:2
      },
      {
        title: 'Bahaya Makanan Junkfood',
        content: 'Berbahaya memakan makanan yang tidak sehat',
        image: 'gambar1.jpg',
        authorId:1,
        categoryId:7,
      },
      {
        title: 'Liburan Yang Menyenangkan',
        content: 'Saya menikmati liburan yang menyenangkan',
        image: 'gambar1.jpg',
        authorId:1,
        categoryId:10,
      },
    ], {});
  },

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_categories', [
      {
        name: 'Programing',
      },
      {
        name: 'Sport',
      },
      {
        name: 'Game',
      },
      {
        name: 'Music'
      },
      {
        name: 'Health',
      },
      {
        name: 'Animal'
      },
      {
        name: 'Food',
      },
      {
        name: 'Movie'
      },
      {
        name: 'Life Styles'
      },
      {
        name: 'Holiday',
      }

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_categories', null, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_articles', null, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_users', null, {});
  }
};
