import { FunctionalComponent, h } from 'preact'; /** @jsx h */
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

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

const AppExample: FunctionalComponent = () => {
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
          <Link href="/home" class={styles.AppLink}>Home</Link>
        </li>
        <li>
          <Link href="/app-example" class={styles.AppLink}>App Example</Link>
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
};

export default AppExample;
