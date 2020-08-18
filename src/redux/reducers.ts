import { combineReducers } from 'redux';
import {
  INCREMENT, DECREMENT, RESET, SET_BOOKS,
} from './actionTypes';

function age(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    case RESET:
      return action.age;
    default:
      return state;
  }
}

function name(state = '', action) {
  return state;
}

function books(state = [], action) {
  switch (action.type) {
    case SET_BOOKS:
      return action.payload || [];
    default:
      return state;
  }
}

const reducers = combineReducers({
  age,
  name,
  books,
});

export default reducers;
