import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FACEBOOK_PAGE_URL } from '@/shared/constants/site';
import { renderWithProviders } from '@/test/render';
import { AboutPage } from './AboutPage';

const GITHUB_HOST = 'github.com';

describe('AboutPage', () => {
  it('shows the site values without the open source card', () => {
    renderWithProviders(<AboutPage />);

    expect(screen.getByRole('heading', { name: '資訊互通' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '風險減少' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '開源透明' })).not.toBeInTheDocument();
    expect(screen.queryByText(/開源|GitHub/)).not.toBeInTheDocument();
  });

  it('links to the fan page but not to the source code', () => {
    renderWithProviders(<AboutPage />);

    expect(screen.getByRole('link', { name: '粉絲專頁' })).toHaveAttribute('href', FACEBOOK_PAGE_URL);
    expect(screen.queryByRole('link', { name: /原始碼/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link').some((link) => link.getAttribute('href')?.includes(GITHUB_HOST))).toBe(false);
  });
});
