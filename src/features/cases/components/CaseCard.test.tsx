import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CaseListItem } from '@/shared/api/types';
import { renderWithProviders } from '@/test/render';
import { CaseCard } from './CaseCard';

const MINUTES_AGO = 5;

const buildCase = (overrides: Partial<CaseListItem> = {}): CaseListItem => ({
  id: 7,
  title: '房客連續三個月沒繳房租',
  content: '【租約期間】2024 年 3 月起\n\n【發生經過】連續三個月未繳房租。',
  location: '台北市',
  district: '大安區',
  rent: 18000,
  defendantName: '王*明',
  defendantPhone: '09*****678',
  defendantIdNo: '',
  imageUrls: ['https://example.com/1.png', 'https://example.com/2.png', 'https://example.com/3.png', 'https://example.com/4.png', 'https://example.com/5.png'],
  authorDisplayName: '大安區包租公',
  likeCount: 1234,
  commentCount: 3,
  createdAt: new Date(Date.now() - MINUTES_AGO * 60_000).toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('CaseCard', () => {
  it('renders the community source badge, masked target and summary info', async () => {
    renderWithProviders(<CaseCard item={buildCase()} />);

    expect(await screen.findByRole('heading', { name: '房客連續三個月沒繳房租' })).toBeInTheDocument();
    expect(screen.getByText('網友回報・未經查證')).toBeInTheDocument();
    expect(screen.getByText('王*明')).toBeInTheDocument();
    expect(screen.getByText('台北市 大安區')).toBeInTheDocument();
    expect(screen.getByText('月租 18,000 元')).toBeInTheDocument();
    expect(screen.getByText(`${MINUTES_AGO} 分鐘前`)).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('大安區包租公')).toBeInTheDocument();
  });

  it('collapses line breaks in the excerpt and links to the detail page', async () => {
    renderWithProviders(<CaseCard item={buildCase()} />);

    expect(await screen.findByText('【租約期間】2024 年 3 月起 【發生經過】連續三個月未繳房租。')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/cases/7');
  });

  it('shows up to three thumbnails with a +N overlay for the rest', async () => {
    renderWithProviders(<CaseCard item={buildCase()} />);

    expect(await screen.findByLabelText('5 張證據照片')).toBeInTheDocument();
    expect(screen.getAllByRole('presentation')).toHaveLength(3);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('falls back to anonymous author and hides thumbnails when there are no images', async () => {
    renderWithProviders(<CaseCard item={buildCase({ authorDisplayName: undefined, imageUrls: [], rent: 0 })} />);

    expect(await screen.findByText('匿名網友')).toBeInTheDocument();
    expect(screen.getByText('月租 未提供')).toBeInTheDocument();
    expect(screen.queryByLabelText(/張證據照片/)).not.toBeInTheDocument();
  });
});
