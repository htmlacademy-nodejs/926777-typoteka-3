'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticle(id, {comments}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  getRecentComments() {
    return this._load(`/articles/comments`);
  }

  createCategory(data) {
    return this._load(`/categories/add`, {
      method: HttpMethod.POST,
      data,
    });
  }

  updateCategory(id, data) {
    return this._load(`/categories/${id}/update`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}/delete`, {
      method: HttpMethod.DELETE,
    });
  }

  deleteComment(id, commentId) {
    return this._load(`/articles/${id}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
    });
  }

}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
