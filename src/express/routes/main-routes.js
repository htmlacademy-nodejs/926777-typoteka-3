'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncMiddleware} = require(`../../utils`);

const mainRouter = new Router();

mainRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const [
    articles,
    categories,
  ] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true),
  ]);

  res.render(`main`, {articles, categories});
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

mainRouter.get(`/categories`, asyncMiddleware(async (req, res) => {
  const categories = await api.getCategories(true);
  res.render(`all-categories`, {categories});
}));

module.exports = mainRouter;
