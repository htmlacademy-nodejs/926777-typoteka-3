'use strict';

const express = require(`express`);
const {
  HttpCode,
  API_PREFIX,
  ExitCode
} = require(`../../constants`);

const createApiRouter = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;
const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((it) => it === undefined);

const DEFAULT_PORT = 3000;
const logger = getLogger({name: `api`});

const createApp = async () => {
  const app = express();
  app.use(express.json());
  app.use(API_PREFIX, await createApiRouter());
  app.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });
  app.use((req, res) => {
    res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });
  app.use((err, _req, _res, _next) => {
    logger.error(`An error occurred on processing request: ${err.message}`);
  });

  return app;
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const app = await createApp();
    if (somethingIsNotDefined) {
      throw new Error(`One or more environmental variables are not defined`);
    }
    logger.info(`Trying to connect to database...`);
    try {
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    app.listen(port)
    .on(`listening`, () => {
      logger.info(`Listening to connections on ${port}`);
    })
    .on(`error`, (err) => {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    });
    logger.info(`Connection to database established`);
  }
};

