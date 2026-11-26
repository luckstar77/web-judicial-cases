const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const YESTERDAY_DAYS = 1;
const DATE_PART_LENGTH = 2;

const pad = (value: number): string => String(value).padStart(DATE_PART_LENGTH, '0');

const parseDate = (value: string | Date): Date | null => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** `2024-05-01` / ISO → `2024/05/01` */
export const formatDate = (value: string | Date): string => {
  const date = parseDate(value);
  if (!date) {
    return '';
  }
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
};

/** 判決日期 `YYYY-MM-DD`（不受時區影響）→ `2024/05/01` */
export const formatJudgmentDate = (jdate: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(jdate);
  return match ? `${match[1]}/${match[2]}/${match[3]}` : jdate;
};

/**
 * Dcard 風格相對時間：剛剛 / N 分鐘前 / N 小時前 / 昨天 / N 天前 / M月D日 / YYYY年M月D日。
 */
export const formatRelativeTime = (value: string | Date, now: Date = new Date()): string => {
  const date = parseDate(value);
  if (!date) {
    return '';
  }
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / MS_PER_MINUTE);
  if (diffMinutes < 1) {
    return '剛剛';
  }
  if (diffMinutes < MINUTES_PER_HOUR) {
    return `${diffMinutes} 分鐘前`;
  }
  const diffHours = Math.floor(diffMinutes / MINUTES_PER_HOUR);
  if (diffHours < HOURS_PER_DAY) {
    return `${diffHours} 小時前`;
  }
  const diffDays = Math.floor(diffHours / HOURS_PER_DAY);
  if (diffDays === YESTERDAY_DAYS) {
    return '昨天';
  }
  if (diffDays < DAYS_PER_WEEK) {
    return `${diffDays} 天前`;
  }
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};
