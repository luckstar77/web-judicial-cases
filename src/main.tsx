import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { IS_API_MOCK } from '@/shared/constants/env';
import { initAnalytics } from '@/shared/utils/analytics';

const ROOT_ELEMENT_ID = 'root';

const enableMocking = async (): Promise<void> => {
  if (!IS_API_MOCK) {
    return;
  }
  const { startMockWorker } = await import('@/mocks/browser');
  await startMockWorker();
};

const bootstrap = async () => {
  await enableMocking();
  initAnalytics();
  const container = document.getElementById(ROOT_ELEMENT_ID);
  if (!container) {
    throw new Error('Root element not found');
  }
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

void bootstrap();
