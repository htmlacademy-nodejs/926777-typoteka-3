'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {id} = req.params;
  const count = await service.countByCategory(id);
  if (count > 0) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Нельзя удалить. В данной категории есть публикации!`);
    return;
  }
  next();
};
