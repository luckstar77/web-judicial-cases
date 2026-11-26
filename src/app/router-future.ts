/** React Router v7 future flags（v6 下提前啟用，並消除升級警告）。 */
export const ROUTER_FUTURE_FLAGS = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
} as const;

export const ROUTER_PROVIDER_FUTURE_FLAGS = { v7_startTransition: true } as const;
