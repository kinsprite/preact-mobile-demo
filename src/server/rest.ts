/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, import/no-extraneous-dependencies */
import Rest from './restClass';

const { getBooks } = require('./apiBooks');

const rest = Rest.create({
  context: '',
});

rest.get('/books', getBooks);

export default rest;
