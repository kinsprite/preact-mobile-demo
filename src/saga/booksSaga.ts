import { Saga } from 'redux-saga';
import { put, takeEvery, call } from 'redux-saga/effects';

import { RELOAD_BOOKS } from '../redux/actionTypes';
import { setBooks } from '../redux/actionCreators';

import fetchBooks from '../service/fetchBooks';

function* reloadBooks() {
  const books = yield call(fetchBooks);
  yield put(setBooks(books));
}

const booksSaga: Saga = function* booksSaga() {
  yield takeEvery(RELOAD_BOOKS, reloadBooks);
};

export default booksSaga;
