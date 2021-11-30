'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let articles;
    if (limit || offset) {
      articles = await articleService.findPage({limit, offset});
    } else {
      articles = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/comments`, async (req, res) => {
    try {
      const comments = await commentService.findRecent();
      return res.status(HttpCode.OK).json(comments);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {comments} = req.query;
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId, comments);
    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .json({error: `Not found with ${articleId}`});
    }
    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articleService.findOne(articleId);
    if (!existArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .json({error: `Not found with ${existArticle}`});
    }
    const updateArticle = articleService.update(articleId, req.body);
    return res.status(HttpCode.OK)
      .json(updateArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);
    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .json({error: `Not found`});
    }
    return res.status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);
    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    try {
      const {commentId} = req.params;
      const deleted = await commentService.drop(commentId);
      if (!deleted) {
        return res.status(HttpCode.NOT_FOUND)
        .json({error: `Not found`});
      }
      return res.status(HttpCode.OK)
        .json(deleted);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.create(articleId, req.body);
    return res.status(HttpCode.CREATED)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    try {
      const {commentId} = req.params;
      const deleted = await commentService.drop(commentId);
      if (!deleted) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found`);
      }
      return res.status(HttpCode.OK)
        .json(deleted);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });
};
