'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  ArticleService,
  SearchService,
  CommentService,
} = require(`../data-service`);

const createRouter = async () => {
  const app = new Router();
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData), new CommentService());

  return app;
};

module.exports = createRouter;
