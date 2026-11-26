import { setupWorker } from 'msw/browser';
import { createHandlers } from './handlers';

const SERVICE_WORKER_URL = '/mockServiceWorker.js';

/** `npm run dev:mock`：以 Service Worker 攔截 API 請求。 */
export const startMockWorker = async (): Promise<void> => {
  const worker = setupWorker(...createHandlers({ latency: true }));
  await worker.start({
    serviceWorker: { url: SERVICE_WORKER_URL },
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
};
