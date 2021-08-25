"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullText: {
    type: DataTypes.STRING,
    field: `full_text`,
    allowNull: false
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: DataTypes.STRING,
  createdDate: {
    type: DataTypes.DATE,
    field: `create_date`,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
