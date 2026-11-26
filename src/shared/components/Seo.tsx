import { Helmet } from 'react-helmet-async';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME } from '@/shared/constants/site';

interface SeoProps {
  title?: string;
  description?: string;
}

/** 每頁的 `<title>` 與 description。 */
export function Seo({ title, description = DEFAULT_DESCRIPTION }: SeoProps) {
  const fullTitle = title ? `${title}｜${SITE_NAME}` : DEFAULT_TITLE;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
}
