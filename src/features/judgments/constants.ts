export const JUDGMENT_PAGE_SIZE = 10;

export const WARNING_DEFAULTS = {
  city: '台北市',
  rentMin: 0,
  /** 合約預設上限 */
  rentMax: 1_000_000,
  minCount: 2,
} as const;

/** 租金滑桿：0 – 10 萬，拉到最右代表「10 萬以上」。 */
export const RENT_SLIDER = {
  min: 0,
  max: 100_000,
  step: 1_000,
} as const;

export const MIN_COUNT_OPTIONS = [1, 2, 3, 5] as const;

export const JUDGMENT_OUTCOME_LABELS = {
  plaintiff: '原告勝訴',
  defendant: '被告勝訴',
  unknown: '判決結果未標示',
} as const;

/** 沿用舊版 WinnerTypo：無勝訴方時顯示「無」。 */
export const NO_WINNER_TEXT = '無';
