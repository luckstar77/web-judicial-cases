import { Fragment } from 'react';
import { splitHighlight } from '@/shared/utils/highlight';

interface HighlightTextProps {
  text: string;
  keyword?: string;
}

/** 以 `<mark>` 標示關鍵字（不分大小寫）。 */
export function HighlightText({ text, keyword }: HighlightTextProps) {
  const segments = splitHighlight(text, keyword);
  return <>{segments.map((segment, index) => (segment.match ? <mark key={index}>{segment.text}</mark> : <Fragment key={index}>{segment.text}</Fragment>))}</>;
}
