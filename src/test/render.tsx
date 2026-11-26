import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { createQueryClient } from '@/app/query-client';
import { ROUTER_FUTURE_FLAGS, ROUTER_PROVIDER_FUTURE_FLAGS } from '@/app/router-future';

interface RenderOptions {
  route?: string;
  /** 其他路由（例如導頁目標），用來驗證 navigate 結果 */
  extraRoutes?: { path: string; element: ReactElement }[];
}

export interface RenderWithProvidersResult extends RenderResult {
  router: ReturnType<typeof createMemoryRouter>;
}

/** 以完整 Provider（Query / Theme / Auth / Snackbar / Helmet）與記憶體路由渲染元件。 */
export const renderWithProviders = (ui: ReactElement, { route = '/', extraRoutes = [] }: RenderOptions = {}): RenderWithProvidersResult => {
  const queryClient = createQueryClient();
  queryClient.setDefaultOptions({ queries: { retry: false, staleTime: 0 }, mutations: { retry: false } });
  const router = createMemoryRouter([{ path: route.split('?')[0], element: ui }, ...extraRoutes], {
    initialEntries: [route],
    future: ROUTER_FUTURE_FLAGS,
  });
  const result = render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} future={ROUTER_PROVIDER_FUTURE_FLAGS} />
    </AppProviders>,
  );
  return { ...result, router };
};
