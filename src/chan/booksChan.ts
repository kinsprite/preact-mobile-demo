import { ChanHandler } from '../redux/chanMiddleware';
import fetchBooks from '../service/fetchBooks';
import { setBooks } from '../redux/actionCreators';
import { RELOAD_BOOKS } from '../redux/actionTypes';
import { chanMiddleware } from '../redux/store';

const reloadBooksHandler: ChanHandler = async (state, action, dispatch) => {
  const books = await fetchBooks();
  dispatch(setBooks(books));
};

chanMiddleware.run(RELOAD_BOOKS, reloadBooksHandler);
