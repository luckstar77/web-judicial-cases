export interface HighlightSegment {
  text: string;
  match: boolean;
}

const REGEXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

const escapeRegExp = (value: string): string => value.replace(REGEXP_SPECIAL_CHARS, '\\$&');

/** 將文字依關鍵字切段（不分大小寫），供 `<mark>` 標示。 */
export const splitHighlight = (text: string, keyword?: string): HighlightSegment[] => {
  const trimmed = keyword?.trim();
  if (!trimmed) {
    return [{ text, match: false }];
  }
  const pattern = new RegExp(`(${escapeRegExp(trimmed)})`, 'gi');
  const lowerKeyword = trimmed.toLowerCase();
  return text
    .split(pattern)
    .filter((segment) => segment.length > 0)
    .map((segment) => ({ text: segment, match: segment.toLowerCase() === lowerKeyword }));
};

export const isSameName = (a?: string, b?: string): boolean => Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());
