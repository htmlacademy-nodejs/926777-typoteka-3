'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`../../constants`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`
};

const schema = Joi.object({
  text: Joi.string().min(20).messages({
    'string.min': ErrorCommentMessage.TEXT
  })
});

module.exports = (req, res, next) => {
  const comments = req.body;
  console.log("midleware", comments)

  const {error} = schema.validate(comments, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
