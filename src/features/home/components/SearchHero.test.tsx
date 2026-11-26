import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { COMMUNITY_SEARCH_REASON } from '@/features/cases/use-community-search';
import { MOCK_ACCESS_TOKEN_PREFIX } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { API_CODES, API_PATHS } from '@/shared/constants/api';
import { API_BASE_URL } from '@/shared/constants/env';
import { ROUTES } from '@/shared/constants/routes';
import { TOKEN_STORAGE_KEY } from '@/shared/constants/storage-keys';
import { renderWithProviders } from '@/test/render';
import { SearchHero } from './SearchHero';

const EXTRA_ROUTES = [
  { path: ROUTES.judgments, element: <p>judgment results</p> },
  { path: ROUTES.cases, element: <p>case results</p> },
];

const renderHero = () => renderWithProviders(<SearchHero />, { extraRoutes: EXTRA_ROUTES });

const keywordOf = (search: string) => new URLSearchParams(search).get('keyword');

describe('SearchHero', () => {
  it('shows stat chips from GET /v1/stats', async () => {
    server.use(
      http.get(`${API_BASE_URL}${API_PATHS.stats}`, () =>
        HttpResponse.json({ status: 'ok', code: API_CODES.success, data: { judgmentCount: 12345, caseCount: 67, userCount: 890 } }),
      ),
    );

    renderHero();

    expect(await screen.findByText('已收錄 12,345 筆判決')).toBeInTheDocument();
    expect(screen.getByText('67 則網友回報')).toBeInTheDocument();
    expect(screen.getByText('890 位實名會員')).toBeInTheDocument();
  });

  it('navigates to judgment search results with the keyword', async () => {
    const user = userEvent.setup();
    const { router } = renderHero();

    await user.type(screen.getByRole('textbox', { name: '輸入姓名查詢判決' }), '王大明');
    await user.click(screen.getByRole('button', { name: '查詢' }));

    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTES.judgments));
    expect(keywordOf(router.state.location.search)).toBe('王大明');
    expect(await screen.findByText('judgment results')).toBeInTheDocument();
  });

  it('does not submit an empty keyword', async () => {
    const user = userEvent.setup();
    const { router } = renderHero();

    await user.click(screen.getByRole('button', { name: '查詢' }));

    expect(router.state.location.pathname).toBe(ROUTES.home);
  });

  it('opens the login dialog when searching community reports while logged out', async () => {
    const user = userEvent.setup();
    const { router } = renderHero();

    await user.click(screen.getByRole('button', { name: /網友回報/ }));
    await user.type(screen.getByRole('textbox', { name: '輸入姓名、電話或身分證查詢網友回報' }), '0912345678');
    await user.click(screen.getByRole('button', { name: '查詢' }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent(COMMUNITY_SEARCH_REASON);
    expect(router.state.location.pathname).toBe(ROUTES.home);
  });

  it('goes straight to community search results when logged in', async () => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, `${MOCK_ACCESS_TOKEN_PREFIX}${encodeURIComponent('+886912345678')}`);
    const user = userEvent.setup();
    const { router } = renderHero();

    await user.click(screen.getByRole('button', { name: /網友回報/ }));
    await user.type(screen.getByRole('textbox', { name: '輸入姓名、電話或身分證查詢網友回報' }), '王大明');
    await user.click(screen.getByRole('button', { name: '查詢' }));

    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTES.cases));
    expect(keywordOf(router.state.location.search)).toBe('王大明');
  });
});
