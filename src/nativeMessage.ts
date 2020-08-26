// Handle message for Android Native

import { Dispatch } from 'redux';
import { nativeMessage } from './redux/actionCreators';
import { getStore, chanMiddleware } from './redux/store';
import { ChanHandler } from './redux/chanMiddleware';
import { NATIVE_MSG_PREFIX } from './redux/actionTypes';

type PreloadMsgType = {
  msgId: string;
  payload: string;
};

let preloadMessages: PreloadMsgType[] = [];

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
  const store = getStore();

  if (!store) {
    preloadMessages.push({ msgId, payload });
    return;
  }

  let payloadObj = payload;

  if (payload && typeof payload === 'string') {
    try {
      payloadObj = JSON.parse(payload);
    } catch (e) {
      console.error(`[ERROR]: Native Message "${msgId}", invalid JSON payload `, e); // eslint-disable-line
    }
  }

  store.dispatch(nativeMessage(msgId, payloadObj));
}

function flushPreloadMessages(dispatch: Dispatch) {
  if (!getStore()) {
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const messages: PreloadMsgType[] = (globalThis.__PRELOAD_NATIVE_MESSAGES__ || []).concat(...preloadMessages);
  // eslint-disable-next-line no-underscore-dangle
  globalThis.__PRELOAD_NATIVE_MESSAGES__ = [];
  preloadMessages = [];

  messages.forEach((m) => nativeMessageHandler(m.msgId, m.payload));
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
  addNativeMessageHandler,
  addNativeMessageHandlerOnce,
  removeNativeMessageHandler,
  nativeMessageHandler as default,
  flushPreloadMessages,
  sendMessageToNative,
};
