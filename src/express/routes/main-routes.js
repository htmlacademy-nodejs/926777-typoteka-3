'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncMiddleware} = require(`../../utils`);

const mainRouter = new Router();

mainRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
}));

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, asyncMiddleware(async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search`, {
      results
    });
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
}));

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
