import global from 'core-js/internals/global';

import './redux/store';
import AppContainer from './AppContainer';

import './root.css';

if (typeof global.globalThis !== 'object') {
  global.globalThis = global;
}

export default AppContainer;
