import global from 'core-js/internals/global';

import './store';
import RouterBase from './RouterBase';

import './root.css';

if (typeof global.globalThis !== 'object') {
  global.globalThis = global;
}

export default RouterBase;
