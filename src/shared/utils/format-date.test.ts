import { describe, expect, it } from 'vitest';
import { formatDate, formatJudgmentDate, formatRelativeTime } from './format-date';

const NOW = new Date(2024, 5, 15, 12, 0, 0);
const minutesAgo = (minutes: number) => new Date(NOW.getTime() - minutes * 60_000);

describe('formatRelativeTime', () => {
  it('shows 剛剛 within a minute (and for future dates)', () => {
    expect(formatRelativeTime(minutesAgo(0), NOW)).toBe('剛剛');
    expect(formatRelativeTime(minutesAgo(-5), NOW)).toBe('剛剛');
  });

  it('shows minutes and hours', () => {
    expect(formatRelativeTime(minutesAgo(5), NOW)).toBe('5 分鐘前');
    expect(formatRelativeTime(minutesAgo(3 * 60), NOW)).toBe('3 小時前');
  });

  it('shows 昨天 and days within a week', () => {
    expect(formatRelativeTime(minutesAgo(30 * 60), NOW)).toBe('昨天');
    expect(formatRelativeTime(minutesAgo(3 * 24 * 60), NOW)).toBe('3 天前');
  });

  it('shows month/day for older dates this year and full date for previous years', () => {
    expect(formatRelativeTime(new Date(2024, 1, 3), NOW)).toBe('2月3日');
    expect(formatRelativeTime(new Date(2022, 10, 20), NOW)).toBe('2022年11月20日');
  });

  it('returns empty string for invalid input', () => {
    expect(formatRelativeTime('not-a-date', NOW)).toBe('');
  });
});

describe('formatDate', () => {
  it('formats as YYYY/MM/DD', () => {
    expect(formatDate(new Date(2024, 0, 5))).toBe('2024/01/05');
  });

  it('formats judgment dates without timezone shift', () => {
    expect(formatJudgmentDate('2023-08-24')).toBe('2023/08/24');
  });
});
