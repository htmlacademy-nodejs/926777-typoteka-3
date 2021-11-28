'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const {asyncMiddleware, getAdmin, getArticlesWithComments} = require(`../../utils`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const upload = require(`../../service/middlewares/upload`);

const csrfProtection = csrf();

const mainRouter = new Router();

mainRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categories,
    lastComments
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true),
    api.getRecentComments()
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  let articlesWithComments = getArticlesWithComments(articles);

  res.render(`main`, {articles, categories, page, totalPages, admin, user, articlesWithComments, lastComments});
}));

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`upload`), asyncMiddleware(async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`]
  };
  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    res.render(`sign-up`, {errorMessages, user});
  }
}));

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body.email, req.body.password);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const {user} = req.session;
    res.render(`login`, {user, errorMessages});
  }
});

mainRouter.get(`/logout`, asyncMiddleware((req, res) => {
  delete req.session.user;
  res.redirect(`/`);
}));

mainRouter.get(`/search`, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  try {
    const {search} = req.query;
    if (search === undefined) {
      res.render(`search-first-view`, {user, csrfToken: req.csrfToken()});
      return;
    }

    const results = await api.search(search);

    res.render(`search`, {results, user, csrfToken: req.csrfToken()});
  } catch (error) {
    res.render(`search`, {results: [], user, csrfToken: req.csrfToken()});
  }
}));

mainRouter.get(`/categories`, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const admin = getAdmin(user);
  const categories = await api.getCategories(true);
  if (admin) {
    res.render(`all-categories`, {categories, user, admin, csrfToken: req.csrfToken()});
  } else {
    res.redirect(`/`);
  }
}));

mainRouter.post(`/categories/add`, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const {category} = req.body;
  try {
    await api.createCategory({name: category});
    res.redirect(`/categories`);
  } catch (errors) {
    const errorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories, user, errorMessages, csrfToken: req.csrfToken()});
  }
}));

mainRouter.post(`/categories/:id/update`, csrfProtection, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const {category} = req.body;
  try {
    await api.updateCategory(id, {name: category});
    res.redirect(`/categories`);
  } catch (errors) {
    const updateErrorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories, user, updateErrorMessages, csrfToken: req.csrfToken()});
  }
}));

mainRouter.get(`/categories/:id/delete`, csrfProtection, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  try {
    await api.deleteCategory(id);
    res.redirect(`/categories`);
  } catch (errors) {
    const deleteErrorMessages = errors.response.data.split(`\n`);
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories, user, deleteErrorMessages, csrfToken: req.csrfToken()});
  }
}));

module.exports = mainRouter;
