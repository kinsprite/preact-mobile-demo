import React, { useState, useEffect } from 'react';
import {
  NavLink,
} from 'react-router-dom';

import styles from './HomeApp.module.css';
import {
  addNativeMessageHandler,
  removeNativeMessageHandler,
  sendMessageToNative,
} from '../nativeMessage';

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

function HomeApp(): JSX.Element {
  const [once] = useState(0);

  useEffect(() => {
    addNativeMessageHandler('event_round_back', eventRoundBackHandler);
    return () => removeNativeMessageHandler('event_round_back', eventRoundBackHandler);
  }, [once]);

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <div className={styles.BtnGroup}>
          <button type="button" onClick={toastShow}>Toast</button>
          <button type="button" onClick={cameraOpen}>Camera</button>
          <button type="button" onClick={vibratorNotify}>Vibrator</button>
          <button type="button" onClick={eventRound}>Event Round</button>
        </div>
        <ul>
          <li>
            <NavLink to="/home" className={styles.AppLink}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/app-example" className={styles.AppLink}>App Example</NavLink>
          </li>
        </ul>
      </header>
      <footer className={styles.AppFooter}>
        <a
          className={styles.FooterLink}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className={styles.FooterLink}
          href="https://qinzhiqiang.cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Micro Frontends
        </a>
      </footer>
    </div>
  );
}

export default HomeApp;
