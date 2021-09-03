"use strict";

const {DataTypes, Model} = require(`sequelize`);

// class Article extends Model {}

// const define = (sequelize) => Article.init({
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   fullText: {
//     type: DataTypes.STRING,
//     field: `full_text`,
//     allowNull: false
//   },
//   announce: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   picture: DataTypes.STRING,
//   createdDate: {
//     type: DataTypes.DATE,
//     field: `create_date`,
//     allowNull: false
//   }
// }, {
//   sequelize,
//   modelName: `Article`,
//   tableName: `articles`
// });

const define = (sequelize) => {
  class Article extends Model {}

  Article.init({
    title: {
      type: new DataTypes.STRING(250),
      allowNull: false
    },
    createdDate: {
      type: DataTypes.DATE,
      field: `create_date`,
      allowNull: false
    },
    announce: {
      type: new DataTypes.STRING(250),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
    },
    fullText: {
      type: new DataTypes.STRING(1000),
      field: `full_text`,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  });
  return Article;
};

module.exports = define;
