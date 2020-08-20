// redux store

import {
  createStore as createStoreOriginal, applyMiddleware, compose,
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

// const sagaMiddleware = createSagaMiddleware();
// const epicMiddleware = createEpicMiddleware();
const chanMiddleware = createChanMiddleware();

const enhancer = composeEnhancers(
  applyMiddleware(thunk, chanMiddleware),
  // applyMiddleware(thunk, sagaMiddleware, epicMiddleware),
  // other store enhancers if any
);

let globalStore: any;

export function createStore(reducer: any, preloadedState?: any) {
  const store = {
    ...createStoreOriginal(reducer, preloadedState, enhancer),
    // runSaga: sagaMiddleware.run,
    // runEpic: epicMiddleware.run,
  };
  globalStore = store;
  return store;
}

// eslint-disable-next-line
export function getStore() {
  return globalStore;
}
