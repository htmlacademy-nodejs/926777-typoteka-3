'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': `"Электронная почта" - обязателена для заполнения`,
    'string.email': `"Электронная почта" - введите валидный email`,
    'any.required': `"Электронная почта" - обязателена для заполнения`
  }),
  firstName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+/).required().messages({
    'string.empty': `"Имя" - обязателено для заполнения`,
    'string.pattern.base': `"Имя содержит некорректные символы`,
    'any.required': `"Имя" - обязателено для заполнения`
  }),
  lastName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+/).required().messages({
    'string.empty': `"Фамилия" - обязателена для заполнения`,
    'string.pattern.base': `"Фамилия содержит некорректные символы`,
    'any.required': `"Фамилия" - обязателена для заполнения`
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': `"Пароль" - обязателен для заполнения`,
    'string.min': `Пароль содержит меньше 6-ти символов`,
    'any.required': `"Пароль" - обязателен для заполнения`
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).messages({
    'string.empty': `"Повтор пароля" - обязателен для заполнения`,
    'string.min': `"Пароль содержит меньше 6-ти символов`,
    'any.only': `"Повтор пароля" - не совпадает с уже введенным поролем`
  }),
  avatar: Joi.string().allow(null, ``),
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Email: ${req.body.email} электронный адрес уже используется`);
  }

  return next();
};
