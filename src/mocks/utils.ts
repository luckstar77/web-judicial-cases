import { HttpResponse } from 'msw';
import type { Paginated } from '@/shared/api/types';
import { API_CODES, HTTP_STATUS, PAGE_LIMIT } from '@/shared/constants/api';

const MASK_CHAR = '*';
const IPV4_VISIBLE_SEGMENTS = 2;
const IPV6_VISIBLE_GROUPS = 2;
const FIRST_PAGE = 1;

/** 與後端 maskHalf 相同：遮罩中間一半（王小明 → 王*明、0912345678 → 09*****678）。 */
export const maskHalf = (value?: string | null): string => {
  if (!value) {
    return '';
  }
  const { length } = value;
  if (length <= 1) {
    return MASK_CHAR;
  }
  const hideLength = Math.floor(length / 2);
  const start = Math.floor((length - hideLength) / 2);
  return value.slice(0, start) + MASK_CHAR.repeat(hideLength) + value.slice(start + hideLength);
};

/** 與後端 maskIp 相同：IPv4 留前兩段、IPv6 留前兩組。 */
export const maskIp = (ip?: string | null): string | undefined => {
  if (!ip) {
    return undefined;
  }
  if (ip.includes('.') && !ip.includes(':')) {
    const segments = ip.split('.');
    return [...segments.slice(0, IPV4_VISIBLE_SEGMENTS), MASK_CHAR, MASK_CHAR].join('.');
  }
  const groups = ip.split(':').filter((group) => group.length > 0);
  return `${groups.slice(0, IPV6_VISIBLE_GROUPS).join(':')}:${MASK_CHAR}`;
};

export const ok = <T>(data: T, status: number = HTTP_STATUS.ok) => HttpResponse.json({ status: 'ok', code: API_CODES.success, data }, { status });

export const fail = (code: number, message: string, status: number = HTTP_STATUS.ok) =>
  HttpResponse.json({ status: 'error', code, error: { message } }, { status });

export const unauthorized = () => fail(API_CODES.unauthorized, 'Unauthorized', HTTP_STATUS.unauthorized);

export const notFound = () => fail(API_CODES.notFound, '查無資料');

export const validationError = (message: string) => fail(API_CODES.validation, message);

export interface PageQuery {
  page: number;
  limit: number;
}

/** 解析 page / limit；不合法時回傳錯誤訊息。 */
export const parsePageQuery = (url: URL): PageQuery | string => {
  const page = url.searchParams.has('page') ? Number(url.searchParams.get('page')) : FIRST_PAGE;
  const limit = url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : PAGE_LIMIT.default;
  if (!Number.isInteger(page) || page < FIRST_PAGE) {
    return 'page must not be less than 1';
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > PAGE_LIMIT.max) {
    return `limit must not be greater than ${PAGE_LIMIT.max}`;
  }
  return { page, limit };
};

/** 與後端 buildPaginated 相同（itemCount = 本頁筆數）。 */
export const paginate = <T>(items: T[], { page, limit }: PageQuery): Paginated<T> => {
  const totalCount = items.length;
  const pageCount = Math.ceil(totalCount / limit);
  const list = items.slice((page - 1) * limit, page * limit);
  return {
    list,
    meta: {
      take: limit,
      page,
      pageCount,
      itemCount: list.length,
      totalCount,
      hasPreviousPage: page > FIRST_PAGE,
      hasNextPage: page < pageCount,
    },
  };
};

/** 決定性亂數（mulberry32），讓假資料每次都一樣。 */
export const createRandom = (seed: number) => {
  let state = seed;
  const next = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
  };
};

const startsWithBytes = (bytes: Uint8Array, signature: number[], offset = 0) => signature.every((value, index) => bytes[offset + index] === value);

const ASCII_RIFF = [0x52, 0x49, 0x46, 0x46];
const ASCII_WEBP = [0x57, 0x45, 0x42, 0x50];
const WEBP_FORMAT_OFFSET = 8;
/** GIF87a / GIF89a */
const GIF_SIGNATURES = [
  [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
  [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
];

const IMAGE_SIGNATURES: { mimetype: string; matches: (bytes: Uint8Array) => boolean }[] = [
  { mimetype: 'image/jpeg', matches: (bytes) => startsWithBytes(bytes, [0xff, 0xd8, 0xff]) },
  { mimetype: 'image/png', matches: (bytes) => startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  { mimetype: 'image/gif', matches: (bytes) => GIF_SIGNATURES.some((signature) => startsWithBytes(bytes, signature)) },
  { mimetype: 'image/webp', matches: (bytes) => startsWithBytes(bytes, ASCII_RIFF) && startsWithBytes(bytes, ASCII_WEBP, WEBP_FORMAT_OFFSET) },
];

/** 判斷圖片格式需要的檔頭長度（WebP 需要前 12 bytes）。 */
export const IMAGE_SIGNATURE_BYTES = 12;

/** 與後端 detectImageType 相同：依檔案開頭的 magic bytes 判斷格式，不信任宣告的 Content-Type。 */
export const detectImageType = (bytes: Uint8Array): string | undefined => IMAGE_SIGNATURES.find((signature) => signature.matches(bytes))?.mimetype;

const TW_COUNTRY_CODE = '+886';

export const normalizePhone = (phone: string): string => {
  const stripped = phone.replace(/[\s-]/g, '');
  if (stripped.startsWith(TW_COUNTRY_CODE)) {
    return stripped;
  }
  if (stripped.startsWith('886')) {
    return `+${stripped}`;
  }
  return `${TW_COUNTRY_CODE}${stripped.replace(/^0/, '')}`;
};
