import { FunctionalComponent, h } from 'preact'; /** @jsx h */
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

import Counter from '../../components/Counter';

import {
  addNativeMessageHandler,
  removeNativeMessageHandler,
} from '../../nativeMessage';

import styles from './Example.module.scss';
import { ChanHandler } from '../../redux/chanMiddleware';

let nativeTick = 0;

const globalTickHandler: ChanHandler = () => {
  nativeTick += 1;
};

addNativeMessageHandler('native_tick', globalTickHandler);

const ExampleApp: FunctionalComponent = () => {
  const [count, setCount] = useState(nativeTick);
  const [once] = useState(0);

  useEffect(() => {
    const tickHandler: ChanHandler = () => {
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
          <Link href="/example" class={styles.AppLink}>Example</Link>
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

export default ExampleApp;