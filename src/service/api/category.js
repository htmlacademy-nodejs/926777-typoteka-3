'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const isCategoryExist = require(`../middlewares/category-exists`);
const categoryValidator = require(`../middlewares/category-validator`);
const categoryWithArticle = require(`../middlewares/category-with-article`);

module.exports = (app, service) => {
  const route = new Router();
  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/add`, [categoryValidator, isCategoryExist(service)], async (req, res) => {
    try {
      const {name} = req.body;
      const category = await service.create(name);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.put(`/:id/update`, [categoryValidator, isCategoryExist(service)], async (req, res) => {
    try {
      const {id} = req.params;
      const {name} = req.body;
      const category = await service.update(id, name);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.delete(`/:id/delete`, categoryWithArticle(service), async (req, res) => {
    try {
      const {id} = req.params;
      const category = await service.drop(id);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  app.use(`/categories`, route);
};

