async function getBooks() {
  return [{
    id: 1,
    name: 'React',
    isbn: '543-233-33',
  }, {
    id: 2,
    name: 'Redux',
    isbn: '543-233-43',
  }, {
    id: 3,
    name: 'Workbox',
    isbn: '543-233-56',
  }];
}

module.exports = {
  getBooks,
};
