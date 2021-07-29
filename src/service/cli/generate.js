'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  getRandomInt,
  shuffle,
  randomDate
} = require(`../../utils`);

const {
  ExitCode
} = require(`../../constants`);

const {MAX_ID_LENGTH} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublication = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: randomDate(`01/02/2021`, `01/05/2021`),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    сategory: [categories[getRandomInt(0, categories.length - 1)]],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
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
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublication(countArticle, titles, categories, sentences, comments));
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
