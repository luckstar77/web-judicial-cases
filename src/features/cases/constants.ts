import type { TaiwanCity } from '@/shared/constants/taiwan-districts';

export const CASE_PAGE_SIZE = 10;
export const LATEST_CASES_COUNT = 6;

/** 對應 POST /v1/cases 合約限制。 */
export const CASE_LIMITS = {
  titleMax: 100,
  contentMax: 5000,
  defendantNameMax: 32,
  defendantPhoneMax: 16,
  defendantIdNoMax: 16,
  rentMin: 0,
  rentMax: 1_000_000,
} as const;

const BYTES_PER_MB = 1024 * 1024;
const MAX_IMAGE_MB = 5;

export const IMAGE_LIMITS = {
  maxCount: 10,
  maxSizeMb: MAX_IMAGE_MB,
  maxSizeBytes: MAX_IMAGE_MB * BYTES_PER_MB,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as readonly string[],
  acceptAttribute: 'image/jpeg,image/png,image/webp,image/gif',
} as const;

export const POPULAR_CITIES: TaiwanCity[] = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'];

export const CASE_GUIDELINES = [
  '只陳述事實：寫下時間、地點、發生了什麼，並附上可佐證的資料。',
  '勿人身攻擊：不使用辱罵字眼，不公開對方完整個資（系統會自動遮罩）。',
  '不實內容需自負法律責任：散布不實內容可能觸犯妨害名譽等相關法律。',
];

/** 「事件經過」結構化提問範本。 */
export const CONTENT_TEMPLATE = [
  '【租約期間】例：2024 年 3 月起，租期一年',
  '【發生經過】什麼時候、發生了什麼事？',
  '【造成損失】例：積欠 2 個月租金共 30,000 元、押金未退',
  '【處理過程】是否溝通、存證信函、調解或提告？',
  '【目前狀況】已解決 / 仍在處理中',
].join('\n\n');

export const CONTENT_PROMPTS = ['什麼時候開始租約？', '發生了什麼事？', '造成哪些損失？', '你如何處理？目前結果？'];

export const EMPTY_FIELD_TEXT = '未提供';
