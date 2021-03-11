'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  randomDate
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const generatePublication = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: randomDate(`01/02/2021`, `01/05/2021`),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    сategory: [categories[getRandomInt(0, categories.length - 1)]],
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
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublication(countOffer, titles, categories, sentences));
    if (args > 1000) {
      console.info(chalk.red(`Limit exceeded. Maximum 1000`));
    } else {
      try {
        await fs.writeFile(FILE_NAME, content);
        console.info(chalk.green(`Operation success. File created.`));
      } catch (err) {
        console.error(chalk.red(`Can't write data to file...`));
      }
    }
  }
};
