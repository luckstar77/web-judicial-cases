type UnauthorizedListener = () => void;

const listeners = new Set<UnauthorizedListener>();

/** 訂閱「token 失效（HTTP 401）」事件，回傳取消訂閱函式。 */
export const subscribeUnauthorized = (listener: UnauthorizedListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const notifyUnauthorized = (): void => {
  listeners.forEach((listener) => listener());
};
