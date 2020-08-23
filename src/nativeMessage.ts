// Handle message for Android Native

import { Dispatch } from 'redux';
import { nativeMessage } from './redux/actionCreators';
import { getStore, chanMiddleware } from './redux/store';
import { ChanHandler } from './redux/chanMiddleware';
import { NATIVE_MSG_PREFIX } from './redux/actionTypes';

let preloadMessages: {msgId: string, payloadObj: any }[] = [];

function flushPreloadMessages(dispatch: Dispatch) {
  // eslint-disable-next-line no-underscore-dangle
  const messages = (globalThis.__PRELOAD_NATIVE_MESSAGES__ || []).concat(...preloadMessages);
  // eslint-disable-next-line no-underscore-dangle
  globalThis.__PRELOAD_NATIVE_MESSAGES__ = [];
  preloadMessages = [];
  messages.forEach((m) => dispatch(nativeMessage(m.msgId, m.payloadObj)));
}

function addNativeMessageHandler(msgId: string, handler: ChanHandler): void {
  chanMiddleware.use(NATIVE_MSG_PREFIX + msgId, handler);
}

function addNativeMessageHandlerOnce(msgId: string, handler: ChanHandler): void {
  chanMiddleware.useOnce(NATIVE_MSG_PREFIX + msgId, handler);
}

function removeNativeMessageHandler(msgId: string, handler: ChanHandler): void {
  chanMiddleware.unUse(NATIVE_MSG_PREFIX + msgId, handler);
}

function nativeMessageHandler(msgId: string, payload: string | null | undefined): void {
  let payloadObj = payload;

  if (payload && typeof payload === 'string') {
    try {
      payloadObj = JSON.parse(payload);
    } catch (e) {
      console.error(`[ERROR]: Native Message "${msgId}", invalid JSON payload `, e); // eslint-disable-line
    }
  }

  const store = getStore();

  if (store) {
    store.dispatch(nativeMessage(msgId, payloadObj));
  } else {
    preloadMessages.push({ msgId, payloadObj });
  }
}

function logMessageToNative(msgId: string, payload: string): void {
  console.info(`[INFO] Message "${msgId}" to native, payload: ${payload}`); // eslint-disable-line
}

const msgLogger = {
  sendMessage: logMessageToNative,
};

function sendMessageToNative(msgId: string, payload?: string): void {
  const injectedNative = (globalThis as any).injectedNative || msgLogger;
  injectedNative.sendMessage(msgId, payload || '');
}

export {
  flushPreloadMessages,
  addNativeMessageHandler,
  addNativeMessageHandlerOnce,
  removeNativeMessageHandler,
  nativeMessageHandler as default,
  sendMessageToNative,
};
