'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [`Без рамки`, `Железо`, `Разное`];

const mockData = [
  {
    "user": `ivanov@example.com`,
    "title": `Как собрать камни бесконечности`,
    "createdDate": `04.01.2021`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "categories": [`Без рамки`],
    "picture": `item0NaN.jpg`,
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Совсем немного... Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`
      }
    ]
  }, {
    "user": `petrov@example.com`,
    "title": `Учим HTML и CSS`,
    "createdDate": `03.01.2021`,
    "announce": `Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "categories": [`Железо`],
    "picture": `item0NaN.jpg`,
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`
      }
    ]
  }, {
    "user": `petrov@example.com`,
    "title": `Борьба с прокрастинацией`,
    "createdDate": `04.01.2021`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов.`,
    "fullText": `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [`Разное`],
    "picture": `item0NaN.jpg`,
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Планируете записать видосик на эту тему? Совсем немного... Согласен с автором!`
      }
    ]
  }
];

const mockUsers = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
  search(app, new DataService(mockDB));
});

describe(`API returns articles based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/search`)
    .query({
      query: `Как собрать камни бесконечности`
    });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct title`, () => expect(response.body[0].title).toBe(`Как собрать камни бесконечности`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
    .get(`/search`)
    .query({
      query: `Продам свою душу`
    })
    .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);
