import { IS_API_MOCK, IS_PRODUCTION } from '@/shared/constants/env';
import { GA_MEASUREMENT_ID } from '@/shared/constants/site';

const GTAG_SCRIPT_URL = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
const PAGE_VIEW_EVENT = 'page_view';

type GtagArgs = [command: string, ...params: unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

const isEnabled = (): boolean => IS_PRODUCTION && !IS_API_MOCK;

/** 只在 production 載入 Google Analytics（沿用舊站 gtag ID）。 */
export const initAnalytics = (): void => {
  if (!isEnabled() || window.gtag) {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  // gtag 需要推入 arguments 物件（不可用陣列），因此使用 function 而非箭頭函式
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = GTAG_SCRIPT_URL;
  document.head.appendChild(script);
};

export const trackPageView = (path: string): void => {
  if (!isEnabled()) {
    return;
  }
  window.gtag?.('event', PAGE_VIEW_EVENT, { page_path: path, page_location: window.location.href, page_title: document.title });
};
