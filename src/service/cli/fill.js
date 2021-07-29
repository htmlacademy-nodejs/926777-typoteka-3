'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  randomDate
} = require(`../../utils`);

const {
  ExitCode
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const PictureRestrict = {
  min: 1,
  max: 16,
};

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateComments = (count, id, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId: id,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublication = (count, titles, categories, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    userId: getRandomInt(1, userCount),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: randomDate(`01/02/2021`, `01/05/2021`),
    anounce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    сategory: [categories[getRandomInt(0, categories.length - 1)]],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX))
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    const articles = generatePublication(countArticle, titles, categories,
        users.length, sentences, commentSentences);

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.flatMap((article, index) => ({articleId: index + 1, categoryId: categories.indexOf(article.category)}));

    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}) =>
      `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(({title, createdDate, anounce, fullText, picture, userId}) =>
      `('${title}', '${createdDate}', '${anounce}', ${fullText}, '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(({articleId, categoryId}) =>
      `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(({text, userId, articleId}) =>
      `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
    INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
    ${userValues};
    INSERT INTO categories(name) VALUES
    ${categoryValues};
    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, created_date, anounce, full_text, picture, user_id) VALUES
    ${articleValues};
    ALTER TABLE articles ENABLE TRIGGER ALL;
    ALTER TABLE article_categories DISABLE TRIGGER ALL;
    INSERT INTO article_categories(article_id, category_id) VALUES
    ${articleCategoryValues};
    ALTER TABLE article_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;
    INSERT INTO COMMENTS(text, user_id, article_id) VALUES
    ${commentValues};
    ALTER TABLE comments ENABLE TRIGGER ALL;`;

    if (args > 1000) {
      console.info(chalk.red(`Limit exceeded. Maximum 1000`));
    } else {
      try {
        await fs.writeFile(FILE_NAME, content);
        console.info(chalk.green(`Operation success. File created.`));
      } catch (err) {
        console.error(chalk.red(`Can't write data to file...`));
        process.exit(ExitCode.ERROR);
      }
    }
  }
};
