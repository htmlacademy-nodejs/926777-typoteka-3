'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const csrf = require(`csurf`);
const {asyncMiddleware, ensureArray, getAdmin} = require(`../../utils`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const auth = require(`../middlewares/auth`);

const csrfProtection = csrf();

const UPLOAD_DIR = `../../service/upload/img/`;

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

articlesRouter.get(`/category/:id`, csrfProtection, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [allArticles, categories] = await Promise.all([
    api.getAllArticles({comments: true}),
    api.getCategories(true),
  ]);

  const category = categories.find((item) => {
    return item.id === +id;
  });
  const articlesInCategory = allArticles.filter((article) => {
    return article.categories.some((item) => {
      return item.id === +id;
    });
  });
  const totalPages = Math.ceil(articlesInCategory.length / ARTICLES_PER_PAGE);
  const articlesByPage = articlesInCategory.slice(offset, offset + limit);

  res.render(`articles-by-category`, {id, categories, page, totalPages, category, articlesByPage, csrfToken: req.csrfToken()});
}));

articlesRouter.get(`/add`, auth, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  const {error} = req.query;
  const categories = await getAddArticleData();

  if (admin) {
    res.render(`new-post`, {categories, error, user, admin, csrfToken: req.csrfToken()});
  } else {
    res.redirect(`/`);
  }
}));

articlesRouter.post(`/add`, auth, upload.single(`upload`), csrfProtection, asyncMiddleware(async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
  const admin = getAdmin(user);
  const articleData = {
    picture: file ? file.filename : ``,
    fullText: body.fullText,
    title: body.title,
    announce: body.announce,
    createdDate: body.createdDate,
    categories: ensureArray(body.category),
    userId: user.id
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`new-post`, {categories, user, admin, errorMessages, csrfToken: req.csrfToken()});
  }
}));

articlesRouter.get(`/edit/:id`, auth, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  const {id} = req.params;
  const {error} = req.query;
  const [article, categories] = await getEditArticleData(id);

  if (admin) {
    res.render(`edit-post`, {id, article, categories, error, user, admin, csrfToken: req.csrfToken()});
  } else {
    res.redirect(`/`);
  }
}));

articlesRouter.post(`/edit/:id`, auth, upload.single(`upload`), asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  const {body, file} = req;
  const {id} = req.params;
  const data = {
    picture: file ? file.filename : ``,
    fullText: body.fullText,
    title: body.title,
    announce: body.announce,
    createdDate: body.createdDate,
    categories: ensureArray(body.category),
    userId: user.id
  };
  try {
    await api.editArticle(id, data);
    res.redirect(`/my`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const [aricle, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);
    res.render(`edit-post`, {id, aricle, categories, user, admin, errorMessages});
  }
}));

articlesRouter.get(`/:id`, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  const {id} = req.params;
  const {error} = req.query;
  const article = await api.getArticle(id, {comments: true});
  const categories = await api.getCategories(true);
  res.render(`post`, {article, id, error, user, admin, categories, csrfToken: req.csrfToken()});
}));

articlesRouter.post(`/:id/comments`, auth, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comments} = req.body;
  try {
    await api.createComment(id, {userId: user.id, text: comments});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const article = await api.getArticle(id, {comments: true});
    const categories = await api.getCategories(true);
    res.render(`post`, {article, id, user, categories, errorMessages, csrfToken: req.csrfToken()});
  }
}));

articlesRouter.post(`/:id/comments/:commentId`, auth, asyncMiddleware(async (req, res) => {
  const {id, commentId} = req.params;
  try {
    await api.deleteComment(id, commentId);
    res.redirect(`/my/comments`);
  } catch (error) {
    res.status(400).render(`errors/404`);
  }
}));

module.exports = articlesRouter;
