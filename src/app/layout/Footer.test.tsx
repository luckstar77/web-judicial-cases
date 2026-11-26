import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FACEBOOK_PAGE_URL } from '@/shared/constants/site';
import { renderWithProviders } from '@/test/render';
import { Footer } from './Footer';

const GITHUB_HOST = 'github.com';

describe('Footer', () => {
  it('links to the fan page', () => {
    renderWithProviders(<Footer />);

    expect(screen.getByRole('link', { name: '粉絲專頁' })).toHaveAttribute('href', FACEBOOK_PAGE_URL);
  });

  it('does not link to the source code repositories', () => {
    renderWithProviders(<Footer />);

    expect(screen.queryByText(/GitHub|原始碼/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('link').some((link) => link.getAttribute('href')?.includes(GITHUB_HOST))).toBe(false);
  });
});
