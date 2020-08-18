// Handle message for Android Native

import Util from './util';

export interface MessageHandlerNext {
  (): void
}

export interface MessageHandler {
  (msgId: string, payload: any, next?: MessageHandlerNext)
}

interface MessageHandlersMapType {
  [msgId: string]: MessageHandler[]
}

const messageHandlersMap : MessageHandlersMapType = {
};

function addNativeMessageHandler(msgId: string, handler: MessageHandler): void {
  if (!Util.isFunction(handler)) {
    throw new Error('Message handler must be a function');
  }

  const handlers = messageHandlersMap[msgId];

  if (handlers) {
    const index = handlers.indexOf(handler);

    if (index === -1) {
      handlers.push(handler);
    }

    return;
  }

  messageHandlersMap[msgId] = [handler];
}

function removeNativeMessageHandler(msgId: string, handler: MessageHandler): void {
  const handlers = messageHandlersMap[msgId];

  if (handlers) {
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }
}

function nativeMessageHandler(msgId: string, payload: string | null | undefined): void {
  const handlers = [...(messageHandlersMap[''] || []), ...(messageHandlersMap[msgId] || [])];

  if (handlers.length === 0) {
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

  let i = 0;

  const next = () => {
    if (i >= handlers.length) {
      return;
    }

    const handler = handlers[i];
    i += 1;

    const argLen = handler.length;

    if (argLen === 2) {
      handler(msgId, payloadObj);
      next();
    } else {
      handler(msgId, payloadObj, next);
    }
  };

  next();
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
  removeNativeMessageHandler,
  nativeMessageHandler as default,
  sendMessageToNative,
};
