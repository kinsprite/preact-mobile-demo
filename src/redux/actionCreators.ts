import {
  NATIVE_MSG_PREFIX,
  INCREMENT, DECREMENT, RESET,
  SET_BOOKS,
  RELOAD_BOOKS,
  NativeMsgAction,
} from './actionTypes';

// import fetchBooks from '../service/fetchBooks';

export function nativeMessage(msgId: string, payload): NativeMsgAction {
  return {
    type: NATIVE_MSG_PREFIX + msgId,
    msgId,
    payload,
  };
}

export function increaseAge() {
  return {
    type: INCREMENT,
  };
}

export function decreaseAge() {
  return {
    type: DECREMENT,
  };
}

export function setAge(age) {
  return {
    type: RESET,
    age,
  };
}

export function resetAge() {
  return setAge(18);
}

export function setBooks(books) {
  return {
    type: SET_BOOKS,
    payload: books,
  };
}

export function reloadBooks() {
  return {
    type: RELOAD_BOOKS,
  };
}

// export function reloadBooks() {
//   return async (dispatch) => {
//     const books = await fetchBooks();
//     dispatch(setBooks(books));
//   };
// }

export function clearBooks() {
  return setBooks([]);
}
