import React from 'react';
import ReactDOM from 'react-dom';
import RouterBase from './RouterBase';

import './root.css';
import nativeMessageHandler from './nativeMessage';

Object.assign(window, {
  nativeMessageHandler,
});

ReactDOM.render(
  <React.StrictMode>
    <RouterBase />
  </React.StrictMode>,
  document.getElementById('root'),
);
