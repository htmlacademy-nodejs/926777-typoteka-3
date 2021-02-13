'use strict';

// функция для получения случайных значений из диапазона
module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция для перетасовки массива
module.exports.shuffle = (someArray) => {
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

module.exports.randomDate = (date1, date2) => {
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
