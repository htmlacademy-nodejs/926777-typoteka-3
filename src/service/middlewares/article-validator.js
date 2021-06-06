'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [
  `title`,
  `announce`,
  `fullText`,
  `createdDate`,
  `category`,
];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));
  console.info(`keysExists`, keysExists);
  console.info(`newArticle`, newArticle);
  console.info(`keys`, keys);

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
