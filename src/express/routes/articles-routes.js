'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {asyncMiddleware, ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const articlesRouter = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId, {comments: true}),
    api.getCategories()
  ]);
  return [article, categories];
};

articlesRouter.get(`/category/:id`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, {comments: false}),
    api.getCategories(true)
  ]);
  res.render(`articles-by-category`, {article, categories});
}));

articlesRouter.get(`/add`, asyncMiddleware(async (req, res) => {
  const {error} = req.query;
  const categories = await getAddArticleData();
  res.render(`new-post`, {categories, error});
}));

articlesRouter.post(`/add`, upload.single(`upload`), asyncMiddleware(async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    fullText: body.fullText,
    title: body.title,
    announce: body.announce,
    createdDate: body.createdDate,
    categories: ensureArray(body.category),
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    res.redirect(`/articles/add?error=${encodeURIComponent(errors.response.data)}`);
  }
}));

articlesRouter.get(`/edit/:id`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const [article, categories] = await getEditArticleData(id);
  res.render(`new-post`, {id, article, categories, error});
}));

articlesRouter.post(`/edit/:id`, upload.single(`upload`), asyncMiddleware(async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const data = {
    picture: file ? file.filename : body[`old-image`],
    title: body.title,
    createdDate: body.date,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: [...body.category] || []
  };
  try {
    await api.editArticle(id, data);
    res.redirect(`/my`);
  } catch (errors) {
    res.redirect(`/articles/edit/${id}?error=${encodeURIComponent(errors.response.data)}`);
  }
}));

articlesRouter.get(`/:id`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const article = await api.getArticle(id, {comments: true});
  res.render(`post`, {article, id, error});
}));

articlesRouter.post(`/:id/comments`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const {comments} = req.body;
  try {
    await api.createComment(id, {text: comments});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(errors.response.data)}`);
  }
}));

module.exports = articlesRouter;
