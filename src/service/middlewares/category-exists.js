'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {name} = req.body;
  const category = await service.findByName(name);
  if (category) {
    res.status(HttpCode.NOT_FOUND)
      .send(`Категория ${name} уже существует`);
    return;
  }
  next();
};
