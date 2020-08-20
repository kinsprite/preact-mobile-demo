import { ChanHandler, ChanDefine } from '../redux/chanMiddleware';
import fetchBooks from '../service/fetchBooks';
import { setBooks } from '../redux/actionCreators';
import { RELOAD_BOOKS } from '../redux/actionTypes';

const reloadBooksHandler: ChanHandler = async (state, action, dispatch) => {
  const books = await fetchBooks();
  dispatch(setBooks(books));
};

const chanArr: ChanDefine[] = [
  {
    type: RELOAD_BOOKS,
    handler: reloadBooksHandler,
  },
];

export default chanArr;
