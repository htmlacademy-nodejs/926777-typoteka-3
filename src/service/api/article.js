'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await articleService.findAll(comments);
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);
    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .json({error: `Not found with ${articleId}`});
    }
    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    console.info(`article`, article);
    console.info(`req`, req);
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, async (req, res) => {
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

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article);
    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(article, commentId);
    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .json({error: `Not found`});
    }
    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article, req.body);
    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
