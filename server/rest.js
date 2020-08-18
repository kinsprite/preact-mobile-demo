/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, import/no-extraneous-dependencies */
const Rest = require('connect-rest');
const { getBooks } = require('./apiBooks');

const rest = Rest.create({
  context: '/api',
});

rest.get('/books', getBooks);

module.exports = rest;
