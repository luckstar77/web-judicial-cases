import { getErrorMessage, isApiErrorCode } from '@/shared/api/api-error';
import { API_CODES } from '@/shared/constants/api';
import { IMAGE_LIMITS } from './constants';

export const CASE_CREATE_FALLBACK_MESSAGE = '發布失敗，請稍後再試';

/** 後端圖片相關的 40000 訊息（英文）→ 中文說明。 */
const IMAGE_CONTENT_MISMATCH_PATTERN = /^images\[(\d+)\] is not a valid /;
const IMAGE_TYPE_PATTERN = /^images must be /;
const FILE_TOO_LARGE_PATTERN = /file too large/i;
const TOO_MANY_FILES_PATTERN = /too many files/i;

const toImageErrorMessage = (message: string): string | null => {
  const mismatch = IMAGE_CONTENT_MISMATCH_PATTERN.exec(message);
  if (mismatch) {
    const position = Number(mismatch[1]) + 1;
    return `第 ${position} 張圖片的檔案內容不是有效的圖片（可能已損毀或副檔名被改過），請移除後改用 JPG、PNG、WebP 或 GIF 圖片`;
  }
  if (IMAGE_TYPE_PATTERN.test(message)) {
    return '圖片僅支援 JPG、PNG、WebP 或 GIF 格式';
  }
  if (FILE_TOO_LARGE_PATTERN.test(message)) {
    return `每張圖片不可超過 ${IMAGE_LIMITS.maxSizeMb}MB`;
  }
  if (TOO_MANY_FILES_PATTERN.test(message)) {
    return `最多只能上傳 ${IMAGE_LIMITS.maxCount} 張圖片`;
  }
  return null;
};

/** 發布回報失敗時給使用者看的訊息：圖片驗證錯誤翻成中文，其餘沿用共用規則（40000 顯示後端訊息）。 */
export const getCaseCreateErrorMessage = (error: unknown): string => {
  if (isApiErrorCode(error, API_CODES.validation) && error instanceof Error) {
    const imageMessage = toImageErrorMessage(error.message);
    if (imageMessage) {
      return imageMessage;
    }
  }
  return getErrorMessage(error, CASE_CREATE_FALLBACK_MESSAGE);
};
