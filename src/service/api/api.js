'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const user = require(`../api/user`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/models`);

const {
  CategoryService,
  ArticleService,
  SearchService,
  CommentService,
  UserService
} = require(`../data-service`);

const createRouter = async () => {
  const app = new Router();
  defineModels(sequelize);

  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));

  return app;
};

module.exports = createRouter;
