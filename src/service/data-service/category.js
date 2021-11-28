
'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  async findByName(name) {
    return await this._Category.findOne({where: {name}});
  }

  async create(data) {
    return await this._Category.create({
      name: data
    });
  }

  async update(id, name) {
    return await this._Category.update(
        {name},
        {where: {id}}
    );
  }

  async countByCategory(id) {
    const result = await this._ArticleCategory.findAll({
      where: {CategoryId: id}
    });
    const count = result.length;
    return +count;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CategoryService;

