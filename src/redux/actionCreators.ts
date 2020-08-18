import {
  INCREMENT, DECREMENT, RESET,
  SET_BOOKS, RELOAD_BOOKS,
} from './actionTypes';

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

export function clearBooks() {
  return setBooks([]);
}
