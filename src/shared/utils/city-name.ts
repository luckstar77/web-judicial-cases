import { TAIWAN_CITIES, type TaiwanCity } from '@/shared/constants/taiwan-districts';

/**
 * 縣市名稱有三種格式：
 * - 網友回報 / 縣市清單：`台北市`（台字、含市縣）
 * - 判決資料：`臺北`（臺字、無市縣）
 * - 地圖 TopoJSON：`臺北市`（臺字、含市縣）
 * `新竹`、`嘉義` 在判決資料中同時代表市與縣。
 */

const SIMPLIFIED_TAI = '台';
const TRADITIONAL_TAI = '臺';
const ADMIN_SUFFIX_PATTERN = /[市縣]$/;

export const toTraditionalTai = (name: string): string => name.replaceAll(SIMPLIFIED_TAI, TRADITIONAL_TAI);

const toSimplifiedTai = (name: string): string => name.replaceAll(TRADITIONAL_TAI, SIMPLIFIED_TAI);

/** 任何格式 → 判決資料格式（`台北市` → `臺北`）。 */
export const toJudgmentCity = (name: string): string => toTraditionalTai(name.trim()).replace(ADMIN_SUFFIX_PATTERN, '');

/** 判決資料格式 → 地圖縣市名稱（`臺北` → `[臺北市]`、`新竹` → `[新竹市, 新竹縣]`）。 */
export const toMapCountyNames = (judgmentCity: string): string[] => {
  const base = toJudgmentCity(judgmentCity);
  return TAIWAN_CITIES.filter((city) => toJudgmentCity(city) === base).map(toTraditionalTai);
};

/** 地圖縣市名稱 / 判決格式 → 縣市清單格式（`臺北市` → `台北市`）；`新竹` 這類歧義取第一個（市）。 */
export const toCaseCity = (name: string): TaiwanCity | undefined => {
  const normalized = toSimplifiedTai(name.trim());
  const exact = TAIWAN_CITIES.find((city) => city === normalized);
  if (exact) {
    return exact;
  }
  const base = toJudgmentCity(name);
  return TAIWAN_CITIES.find((city) => toJudgmentCity(city) === base);
};

/** 縣市清單格式 → 地圖縣市名稱（`台北市` → `臺北市`）。 */
export const toMapCountyName = (caseCity: string): string => toTraditionalTai(caseCity.trim());
