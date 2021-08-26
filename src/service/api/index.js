'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  ArticleService,
  SearchService,
  CommentService,
} = require(`../data-service`);

const createRouter = async () => {
  const app = new Router();
  defineModels(sequelize);

  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));

  return app;
};

module.exports = createRouter;
