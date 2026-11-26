import { describe, expect, it } from 'vitest';
import { ApiError } from '@/shared/api/api-error';
import { API_CODES } from '@/shared/constants/api';
import { getCaseCreateErrorMessage } from './case-create-errors';

const validationError = (message: string) => new ApiError(API_CODES.validation, message);

describe('getCaseCreateErrorMessage', () => {
  it('explains an image whose content does not match its declared type', () => {
    expect(getCaseCreateErrorMessage(validationError('images[1] is not a valid image/png file'))).toBe(
      '第 2 張圖片的檔案內容不是有效的圖片（可能已損毀或副檔名被改過），請移除後改用 JPG、PNG、WebP 或 GIF 圖片',
    );
  });

  it('explains unsupported image formats, oversized files and too many files', () => {
    expect(getCaseCreateErrorMessage(validationError('images must be jpeg, png, webp or gif'))).toBe('圖片僅支援 JPG、PNG、WebP 或 GIF 格式');
    expect(getCaseCreateErrorMessage(validationError('File too large'))).toBe('每張圖片不可超過 5MB');
    expect(getCaseCreateErrorMessage(validationError('Too many files'))).toBe('最多只能上傳 10 張圖片');
  });

  it('falls back to the backend validation message for other fields', () => {
    expect(getCaseCreateErrorMessage(validationError('title should not be empty'))).toBe('title should not be empty');
  });

  it('uses the shared friendly messages for non-validation errors', () => {
    expect(getCaseCreateErrorMessage(new ApiError(API_CODES.tooManyRequests, 'ThrottlerException'))).toBe('操作太頻繁了，請稍候一分鐘再試');
    expect(getCaseCreateErrorMessage(new Error('boom'))).toBe('發布失敗，請稍後再試');
  });
});
