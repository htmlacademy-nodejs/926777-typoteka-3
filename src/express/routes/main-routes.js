'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncMiddleware} = require(`../../utils`);

const mainRouter = new Router();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, asyncMiddleware(async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categories,
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true),
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, categories, page, totalPages});
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
