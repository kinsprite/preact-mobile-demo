import 'promise-polyfill/lib/polyfill';
import 'unfetch/polyfill/index';

import { polyfill as objectAssignPolyfill } from 'es6-object-assign';
import global from 'core-js/internals/global';

objectAssignPolyfill();

if (typeof global.globalThis !== 'object') {
  global.globalThis = global;
}
