'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncMiddleware, getAdmin} = require(`../../utils`);

const myRouter = new Router();

myRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  const articles = await api.getArticles({comments: true});

  if (admin) {
    res.render(`my`, {user, admin, articles});
  } else {
    res.redirect(`/`);
  }
}));

myRouter.get(`/comments`, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  const articles = await api.getArticles({comments: true});
  let comments = [];
  articles.map((article) => article.comments.map((comment) => comments.push(comment)));
  if (admin) {
    res.render(`comments`, {articles, comments, user, admin});
  } else {
    res.redirect(`/`);
  }
}));

module.exports = myRouter;
