import global from 'core-js/internals/global';

import './redux/store';
import App from './App';

import './styles/root.scss';

if (typeof global.globalThis !== 'object') {
  global.globalThis = global;
}

export default App;
