'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncMiddleware} = require(`../../utils`);

const myRouter = new Router();

myRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`my`, {articles});
}));

myRouter.get(`/comments`, asyncMiddleware(async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles: articles.slice(0, 3)});
}));

module.exports = myRouter;
