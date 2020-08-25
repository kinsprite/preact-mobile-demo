import { FunctionalComponent, h } from 'preact'; /** @jsx h */
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

import styles from './HomeApp.module.scss';

import {
  addNativeMessageHandler,
  removeNativeMessageHandler,
  sendMessageToNative,
} from '../../nativeMessage';

function toastShow() {
  sendMessageToNative('toast_show', 'Text from home page');
}

function cameraOpen() {
  sendMessageToNative('camera_open');
}

function vibratorNotify() {
  sendMessageToNative('vibrator_notify');
}

function eventRound() {
  sendMessageToNative('event_round');
}

function eventRoundBackHandler(msgId: string, payload): void {
  sendMessageToNative('toast_show', `Home received msg "${msgId}" from native`);
}

const HomeApp : FunctionalComponent = () => {
  const [once] = useState(0);

  useEffect(() => {
    addNativeMessageHandler('event_round_back', eventRoundBackHandler);
    return () => removeNativeMessageHandler('event_round_back', eventRoundBackHandler);
  }, [once]);

  return (
    <div>
      <header class={styles.AppHeader}>
        <div class={styles.BtnGroup}>
          <button type="button" onClick={toastShow}>Toast</button>
          <button type="button" onClick={cameraOpen}>Camera</button>
          <button type="button" onClick={vibratorNotify}>Vibrator</button>
          <button type="button" onClick={eventRound}>Event Round</button>
        </div>
        <ul>
          <li>
            <Link href="/home" class={styles.AppLink}>Home</Link>
          </li>
          <li>
            <Link href="/example" class={styles.AppLink}>Example</Link>
          </li>
          <li>
            <Link href="/user" class={styles.AppLink}>User</Link>
          </li>
          <li>
            <Link href="/books" class={styles.AppLink}>Books</Link>
          </li>
        </ul>
      </header>
      <footer class={styles.AppFooter}>
        <a
          class={styles.FooterLink}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          class={styles.FooterLink}
          href="https://qinzhiqiang.cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Micro Frontends
        </a>
      </footer>
    </div>
  );
};

export default HomeApp;
