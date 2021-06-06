'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  route.get(`/`, async (req, res) => {
    const categories = await service.findAll();

    res.status(HttpCode.OK)
      .json(categories);
  });

  app.use(`/categories`, route);
};

