'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {asyncMiddleware} = require(`../../utils`);

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

articlesRouter.get(`/category/:id`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, {comments: false}),
    api.getCategories(true)
  ]);
  res.render(`articles-by-category`, {article, categories});
}));

articlesRouter.get(`/add`, asyncMiddleware(async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
}));

articlesRouter.get(`/edit/:id`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, {comments: false}),
    api.getCategories(true)
  ]);
  res.render(`new-post`, {article, categories});
}));

articlesRouter.get(`/:id`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, {comments: true});
  res.render(`post`, {article});
}));

articlesRouter.post(`/add`, upload.single(`upload`), asyncMiddleware(async (req, res) => {
  // в `body` содержатся текстовые данные формы
  // в `file` — данные о сохранённом файле
  const {body, file} = req;
  const articleData = {
    picture: file.filename,
    fullText: body.fullText,
    title: body.title,
    announce: body.announce,
    createdDate: body.createdDate,
    categories: body.category,
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
}));

module.exports = articlesRouter;
