'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  CATEGORIES: `Выберите не менее одной категории`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  TITLE_EMPTY: `"Заголовок" - не может быть пустым`,
  FULLTEXT_MIN: `Описание содержит меньше 30 символов`,
  FULLTEXT_MAX: `Заголовок не может содержать более 1000 символов`,
  ANNOUNCE_EMPTY: `Анонс публикации - не может быть пустым`,
  ANNOUNCE_MIN: `Анонс публикации - должен содержать минимум 30 символов`,
  ANNOUNCE_MAX: `Анонс публикации - должен содержать максимум 250 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
    'string.empty': ErrorArticleMessage.TITLE_EMPTY,
  }),
  fullText: Joi.string().min(30).max(1000).allow(null, ``).messages({
    'string.min': ErrorArticleMessage.FULLTEXT_MIN,
    'string.max': ErrorArticleMessage.FULLTEXT_MAX,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
    'string.empty': ErrorArticleMessage.ANNOUNCE_EMPTY,
  }),
  picture: Joi.string().allow(null, ``),
  createdDate: Joi.string().required(),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
  })
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

