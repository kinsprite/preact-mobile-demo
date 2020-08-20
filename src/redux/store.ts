// redux store

import {
  createStore as createStoreOriginal, applyMiddleware, compose, Store,
} from 'redux';
import thunk from 'redux-thunk';

// import createSagaMiddleware from 'redux-saga';
// import { createEpicMiddleware } from 'redux-observable';

import createChanMiddleware from './chanMiddleware';

const composeEnhancers = process.env.NODE_ENV !== 'production'
  && typeof window === 'object'
  && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  }) : compose;

export const chanMiddleware = createChanMiddleware();
// export const sagaMiddleware = createSagaMiddleware();
// export const epicMiddleware = createEpicMiddleware();

const enhancer = composeEnhancers(
  applyMiddleware(thunk, chanMiddleware),
  // applyMiddleware(thunk, sagaMiddleware, epicMiddleware),
  // other store enhancers if any
);

let globalStore: Store;

export function createStore(reducer: any, preloadedState?: any) {
  const store = createStoreOriginal(reducer, preloadedState, enhancer);
  globalStore = store;
  return store;
}

// eslint-disable-next-line
export function getStore() {
  return globalStore;
}
