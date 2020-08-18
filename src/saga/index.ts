import { Saga } from 'redux-saga';

import booksSaga from './booksSaga';

const sagas: Saga[] = [
  booksSaga,
];

export default sagas;
