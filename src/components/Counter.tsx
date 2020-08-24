import { FunctionalComponent, h } from 'preact'; /** @jsx h */
import { useState, useEffect } from 'preact/hooks';
import styles from './Counter.module.scss';

import controls from '../styles/controls.module.scss';

const Counter: FunctionalComponent = () => {
  const [count, setCount] = useState(0);
  const [once] = useState(0);

  useEffect(() => {
    setCount(1);
    const timerId = setTimeout(() => setCount(2), 100);
    return () => clearTimeout(timerId);
  }, [once]);

  return (
    <div className={styles.row}>
      <span className={styles.label}>
        {' '}
        Count:
        {' '}
        {count}
      </span>
      <button
        type="button"
        className={`${controls.btn} ${styles.btn}`}
        onClick={() => setCount(count - 1)}
      >
        -1
      </button>
      <button
        type="button"
        className={`${controls.btn} ${styles.btn}`}
        onClick={() => setCount(count + 1)}
      >
        +1
      </button>
    </div>
  );
};

export default Counter;
