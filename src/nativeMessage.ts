// Handle message for Android Native

import { nativeMessage } from './redux/actionCreators';
import { getStore, chanMiddleware } from './redux/store';
import { ChanHandler } from './redux/chanMiddleware';
import { NATIVE_MSG_PREFIX } from './redux/actionTypes';

function addNativeMessageHandler(msgId: string, handler: ChanHandler): void {
  chanMiddleware.run(NATIVE_MSG_PREFIX + msgId, handler);
}

function addNativeMessageHandlerOnce(msgId: string, handler: ChanHandler): void {
  chanMiddleware.runOnce(NATIVE_MSG_PREFIX + msgId, handler);
}

function removeNativeMessageHandler(msgId: string, handler: ChanHandler): void {
  chanMiddleware.unRun(NATIVE_MSG_PREFIX + msgId, handler);
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
  }
}

function logMessageToNative(msgId: string, payload: string): void {
  console.info(`[INFO] Message "${msgId}" to native, payload: ${payload}`); // eslint-disable-line
}

const msgLogger = {
  sendMessage: logMessageToNative,
};

function sendMessageToNative(msgId: string, payload?: string): void {
  const injectedNative = (window as any).injectedNative || msgLogger;
  injectedNative.sendMessage(msgId, payload || '');
}

export {
  addNativeMessageHandler,
  addNativeMessageHandlerOnce,
  removeNativeMessageHandler,
  nativeMessageHandler as default,
  sendMessageToNative,
};
