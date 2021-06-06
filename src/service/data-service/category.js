
'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      acc.add(...article.сategory);
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;

