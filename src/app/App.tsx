import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers';
import { createQueryClient } from './query-client';
import { ROUTER_FUTURE_FLAGS, ROUTER_PROVIDER_FUTURE_FLAGS } from './router-future';
import { appRoutes } from './routes';

const router = createBrowserRouter(appRoutes, { future: ROUTER_FUTURE_FLAGS });

export function App() {
  const [queryClient] = useState(createQueryClient);
  return (
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} future={ROUTER_PROVIDER_FUTURE_FLAGS} />
    </AppProviders>
  );
}
