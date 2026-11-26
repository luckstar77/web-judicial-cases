import { setupServer } from 'msw/node';
import { createHandlers } from './handlers';

/** Vitest 使用的 MSW server（每個測試檔共用，handlers 可於測試中覆寫）。 */
export const server = setupServer(...createHandlers());
