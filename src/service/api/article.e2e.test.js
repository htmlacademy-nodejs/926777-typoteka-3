'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `GvYU_b`,
    "title": `Как собрать камни бесконечности`,
    "createdDate": `04.01.2021`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "сategory": [`Без рамки`],
    "comments": [
      {
        "id": `bABoH_`,
        "text": `Совсем немного... Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`
      }
    ]
  }, {
    "id": `Eib10R`,
    "title": `Учим HTML и CSS`,
    "createdDate": `03.01.2021`,
    "announce": `Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "сategory": [`Железо`],
    "comments": [
      {
        "id": `sTbDWo`,
        "text": `Это где ж такие красоты?`
      }, {
        "id": `orxsUf`,
        "text": `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }, {
        "id": `SV629j`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`
      }, {
        "id": `cZg6WT`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`
      }
    ]
  }, {
    "id": `EQLZBZ`,
    "title": `Борьба с прокрастинацией`,
    "createdDate": `04.01.2021`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов.`,
    "fullText": `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "сategory": [`Разное`],
    "comments": [
      {
        "id": `qpN3pO`,
        "text": `Планируете записать видосик на эту тему? Совсем немного... Согласен с автором!`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 articless`, () => expect(response.body.length).toBe(3));
  test(`First article's id equals "GvYU_b"`, () => expect(response.body[0].id).toBe(`GvYU_b`));
});

describe(`API returns the article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/articles/GvYU_b`);
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
    category: [`Без рамки`]
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .post(`/articles`)
    .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
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
  const app = createAPI();

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
    category: [`Без рамки`]
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .put(`/articles/GvYU_b`)
    .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/GvYU_b`)
    .expect((res) => expect(res.body.title).toBe(`Как собрать камни бесконечности`))
  );
});


test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();
  const validArticle = {
    title: `Как собрать камни бесконечности`,
    createdDate: `04.01.2021`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [`Без рамки`]
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change the article with invalid data`, () => {
  const app = createAPI();
  const invalidArticle = {
    title: `Это`,
    announce: `невалидный.`,
    fullText: `объект.`,
    category: [`нет поля createdDate`]
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes the article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .delete(`/articles/GvYU_b`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`GvYU_b`));
  test(`Article count is 3 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

// тесты для комментариев
describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/articles/EQLZBZ/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 1 comments`, () => expect(response.body.length).toBe(1));
  test(`First comment's id is "qpN3pO"`, () => expect(response.body[0].id).toBe(`qpN3pO`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .post(`/articles/EQLZBZ/comments`)
    .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/EQLZBZ/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();
  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();
  return request(app)
    .post(`/articles/EQLZBZ/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .delete(`/articles/EQLZBZ/comments/qpN3pO`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`qpN3pO`));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/EQLZBZ/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/articles/EQLZBZ/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/articles/NOEXST/comments/qpN3pO`)
    .expect(HttpCode.NOT_FOUND);
});
