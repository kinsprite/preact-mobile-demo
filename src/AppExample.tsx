import React, { useState, useEffect } from 'react';
import {
  NavLink,
} from 'react-router-dom';

import Counter from './Counter';

import {
  MessageHandlerNext,
  addNativeMessageHandler,
  removeNativeMessageHandler,
} from './nativeMessage';

import styles from './AppExample.module.scss';

let nativeTick = 0;

function globalTickHandler(msgId: string, payload: any, next?: MessageHandlerNext) {
  nativeTick += 1;
  next();
}

addNativeMessageHandler('native_tick', globalTickHandler);

function AppExample(): JSX.Element {
  const [count, setCount] = useState(nativeTick);
  const [once] = useState(0);

  useEffect(() => {
    const tickHandler = (msgId: string, payload) => {
      setCount(nativeTick);
    };

    addNativeMessageHandler('native_tick', tickHandler);
    return () => removeNativeMessageHandler('native_tick', tickHandler);
  }, [once]);

  return (
    <div className={styles.AppExample}>
      <ul>
        <li>
          <NavLink to="/home" className={styles.AppLink}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/app-example" className={styles.AppLink}>App Example</NavLink>
        </li>
      </ul>
      <p>
        Native tick:
        {' '}
        {count}
      </p>
      <Counter />
    </div>
  );
}

export default AppExample;
