import { ChanHandler } from '../redux/chanMiddleware';
import { setBooks } from '../redux/actionCreators';
import { RELOAD_BOOKS } from '../redux/actionTypes';
import { chanMiddleware } from '../redux/store';

import fetchBooks from '../service/fetchBooks';

const reloadBooksHandler: ChanHandler = async (state, action, dispatch) => {
  const books = await fetchBooks();
  dispatch(setBooks(books));
};

chanMiddleware.use(RELOAD_BOOKS, reloadBooksHandler);
