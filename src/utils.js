'use strict';

// функция для получения случайных значений из диапазона
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция для перетасовки массива
const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }
  return someArray;
};

// функции генерируют случайную дату в выбранном диапозоне
const randomValueBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

const randomDate = (date1, date2) => {
  let dateStart = date1 || `01-01-1970`;
  let dateEnd = date2 || new Date().toLocaleDateString();
  date1 = new Date(dateStart).getTime();
  date2 = new Date(dateEnd).getTime();
  if (date1 > date2) {
    return new Date(randomValueBetween(date2, date1)).toLocaleDateString();
  } else {
    return new Date(randomValueBetween(date1, date2)).toLocaleDateString();
  }
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
};

const getAdmin = (user) => {
  let admin = false;
  if (user && user.id === 1) {
    admin = true;
  }
  return admin;
};

const getArticlesWithComments = (articles) => {
  let articlesWithComments = [];
  articles.map((article) => {
    if (article.comments.length > 0) {
      articlesWithComments.push(article);
    }
  });
  return articlesWithComments;
};

module.exports = {
  ensureArray,
  randomDate,
  shuffle,
  getRandomInt,
  asyncMiddleware,
  getAdmin,
  getArticlesWithComments
};
