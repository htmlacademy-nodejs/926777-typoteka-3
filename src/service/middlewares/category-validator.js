'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.empty': `Название категории не может быть пустым`,
    'string.min': `Название категории должено содержать минимум 5 символов.`,
    'string.max': `Название категории должено содержать не более 30 символов.`,
    'any.required': `Название категории не может быть пустым.`
  }),
});

module.exports = (req, res, next) => {
  const category = req.body;
  const {error} = schema.validate(category);
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
