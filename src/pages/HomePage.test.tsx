import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { API_PATHS } from '@/shared/constants/api';
import { renderWithProviders } from '@/test/render';
import { HomePage } from './HomePage';

const HIDDEN_API_PATHS = [API_PATHS.warningNames, API_PATHS.cityStats];

describe('HomePage', () => {
  const requestedPaths: string[] = [];
  const recordRequest = ({ request }: { request: Request }) => {
    requestedPaths.push(new URL(request.url).pathname);
  };

  beforeEach(() => {
    requestedPaths.length = 0;
    server.events.on('request:start', recordRequest);
  });

  afterEach(() => {
    server.events.removeListener('request:start', recordRequest);
  });

  it('renders the home sections without the high-risk list', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByRole('heading', { name: '三步驟，安心簽約' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '資料來源，一眼分清' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '最新網友回報' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '高風險名單' })).not.toBeInTheDocument();
  });

  it('does not request the warning names or city stats', async () => {
    renderWithProviders(<HomePage />);

    await screen.findByRole('heading', { name: '最新網友回報' });
    expect(requestedPaths.some((path) => HIDDEN_API_PATHS.some((hidden) => path.endsWith(hidden)))).toBe(false);
  });
});
