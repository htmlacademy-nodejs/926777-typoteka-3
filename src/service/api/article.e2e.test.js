'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [`Без рамки`, `Железо`, `Разное`];

const mockData = [
  {
    "title": `Как собрать камни бесконечности`,
    "createdDate": `04.01.2021`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "categories": [`Без рамки`],
    "picture": `item0NaN.jpg`,
    "comments": [
      {"text": `Совсем немного... Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`}
    ]
  }, {
    "title": `Учим HTML и CSS`,
    "createdDate": `03.01.2021`,
    "announce": `Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "categories": [`Железо`],
    "picture": `item0NaN.jpg`,
    "comments": [
      {"text": `Это где ж такие красоты?`},
      {"text": `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`},
      {"text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`},
      {"text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`}
    ]
  }, {
    "title": `Борьба с прокрастинацией`,
    "createdDate": `04.01.2021`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов.`,
    "fullText": `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [`Разное`],
    "picture": `item0NaN.jpg`,
    "comments": [
      {"text": `Планируете записать видосик на эту тему? Совсем немного... Согласен с автором!`}
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockData});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 articless`, () => expect(response.body.length).toBe(3));
  test(`First article's title equals "Как собрать камни бесконечности"`, () => expect(response.body[0].title).toBe(`Как собрать камни бесконечности`));
});

describe(`API returns the article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Как собрать камни бесконечности"`, () => expect(response.body.title).toBe(`Как собрать камни бесконечности`));
});

describe(`API creates the article if data is valid`, () => {
  const newArticle = {
    title: `Как собрать камни бесконечности`,
    createdDate: `04.01.2021`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [`Без рамки`],
    picture: `pic.jpg`
  };
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .post(`/articles`)
    .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create the article if data is invalid`, () => {
  const newArticle = {
    title: `Пиу пиу`,
    announce: `Олала.`,
    fullText: `Эгегей.`,
    category: [`Абра кадабра`]
  };
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Как собрать камни бесконечности`,
    createdDate: `04.01.2021`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [`Без рамки`],
    picture: `pic.jpg`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .put(`/articles/1`)
    .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Как собрать камни бесконечности`))
  );
});


test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const validArticle = {
    title: `Как собрать камни бесконечности`,
    createdDate: `04.01.2021`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [`Без рамки`]
  };
  const app = await createAPI();

  return request(app)
    .put(`/articles/333FFFrrr`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change the article with invalid data`, async () => {
  const invalidArticle = {
    title: `Это`,
    announce: `невалидный.`,
    fullText: `объект.`,
    category: [`нет поля createdDate`],
  };
  const app = await createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes the article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article count is 2 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();
  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

// тесты для комментариев
describe(`API returns a list of comments to given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/articles/1?comments=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 1 comments`, () => expect(response.body.comments.length).toBe(1));
  test(`First comment's text is "Совсем немного... Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!"`, () => expect(response.body.comments[0].text).toBe(`Совсем немного... Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .post(`/articles/1/comments`)
    .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/1?comments=true`)
    .expect((res) => expect(res.body.comments.length).toBe(2))
  );
});

// test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
//   const app = await createAPI();
//   return request(app)
//     .post(`/articles/20/comments`)
//     .send({
//       text: `Неважно`
//     })
//     .expect(HttpCode.NOT_FOUND);
// });

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();
  return request(app)
    .post(`/articles/EQLZBZ/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/1?comments=true`)
    .expect((res) => expect(res.body.comments.length).toBe(1))
  );
});

// test(`API refuses to delete non-existent comment`, async () => {
//   const app = await createAPI();
//   return request(app)
//     .delete(`/articles/222/comments/555`)
//     .expect(HttpCode.NOT_FOUND);
// });

// test(`API refuses to delete a comment to non-existent article`, async () => {
//   const app = await createAPI();
//   return request(app)
//     .delete(`/articles/456789900/comments/1`)
//     .expect(HttpCode.NOT_FOUND);
// });
