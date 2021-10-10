'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`../../constants`);

const ErrorOfferMessage = {
  CATEGORIES: `Выберите не менее одной категории`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  TITLE_EMPTY: `"Заголовок" - не может быть пустым`,
  FULLTEXT_MIN: `Описание содержит меньше 30 символов`,
  FULLTEXT_MAX: `Заголовок не может содержать более 1000 символов`,
  ANNOUNCE_EMPTY: `Анонс публикации - не может быть пустым`,
  ANNOUNCE_MIN: `Анонс публикации - должен содержать минимум 30 символов`,
  ANNOUNCE_MAX: `Анонс публикации - должен содержать максимум 250 символов`
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorOfferMessage.CATEGORIES
      })
  ).min(1).required(),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.TITLE_MIN,
    'string.max': ErrorOfferMessage.TITLE_MAX,
    'string.empty': ErrorOfferMessage.TITLE_EMPTY,
  }),
  fullText: Joi.string().min(30).max(1000).allow(null, ``).messages({
    'string.min': ErrorOfferMessage.FULLTEXT_MIN,
    'string.max': ErrorOfferMessage.FULLTEXT_MAX,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.ANNOUNCE_MIN,
    'string.max': ErrorOfferMessage.ANNOUNCE_MAX,
    'string.empty': ErrorOfferMessage.ANNOUNCE_EMPTY,
  }),
  picture: Joi.string().allow(null, ``),
  createdDate: Joi.string().required()
});

// const articleKeys = [
//   `title`,
//   `announce`,
//   `fullText`,
//   `createdDate`,
//   `category`,
// ];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  // const keys = Object.keys(newArticle);
  // const keysExists = articleKeys.every((key) => keys.includes(key));
  const {error} = schema.validate(newArticle, {abortEarly: false});

  // console.info(`keysExists`, keysExists);
  // console.info(`newArticle`, newArticle);
  // console.info(`keys`, keys);

  // if (!keysExists) {
  //   return res.status(HttpCode.BAD_REQUEST)
  //     .send(`Bad request`);
  // }

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

