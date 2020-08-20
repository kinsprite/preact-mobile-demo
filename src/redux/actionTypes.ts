import {
  Action,
} from 'redux';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';
export const SET_BOOKS = 'SET_BOOKS';
export const RELOAD_BOOKS = 'RELOAD_BOOKS';
export const NATIVE_MSG_PREFIX = 'NATIVE_MESSAGE_';

export interface NativeMsgAction extends Action<string> {
  msgId: string,
  payload: any;
}
