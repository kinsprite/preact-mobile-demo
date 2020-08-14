import { h, render } from 'preact'; /** @jsx h */
import global from 'core-js/internals/global';

import RouterBase from './RouterBase';

import './root.css';
import nativeMessageHandler from './nativeMessage';

global.nativeMessageHandler = nativeMessageHandler;

render(
  <RouterBase />,
  document.getElementById('root'),
);
