import { ROUTES } from '@/shared/constants/routes';

export interface NavItem {
  label: string;
  to: string;
}

export const DESKTOP_NAV_ITEMS: NavItem[] = [
  { label: '首頁', to: ROUTES.home },
  { label: '判決查詢', to: ROUTES.judgments },
  { label: '網友回報', to: ROUTES.cases },
  { label: '常見問題', to: ROUTES.faq },
  { label: '關於我們', to: ROUTES.about },
];

export const isNavActive = (pathname: string, to: string): boolean => {
  if (to === ROUTES.home) {
    return pathname === ROUTES.home;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
};

export const BOTTOM_NAV_VALUES = {
  home: 'home',
  judgments: 'judgments',
  cases: 'cases',
  create: 'create',
  profile: 'profile',
} as const;

export type BottomNavValue = (typeof BOTTOM_NAV_VALUES)[keyof typeof BOTTOM_NAV_VALUES];

export const getBottomNavValue = (pathname: string): BottomNavValue | false => {
  if (pathname === ROUTES.caseCreate) {
    return BOTTOM_NAV_VALUES.create;
  }
  if (isNavActive(pathname, ROUTES.cases)) {
    return BOTTOM_NAV_VALUES.cases;
  }
  if (isNavActive(pathname, ROUTES.judgments)) {
    return BOTTOM_NAV_VALUES.judgments;
  }
  if (isNavActive(pathname, ROUTES.profile)) {
    return BOTTOM_NAV_VALUES.profile;
  }
  if (pathname === ROUTES.home) {
    return BOTTOM_NAV_VALUES.home;
  }
  return false;
};

export const BOTTOM_NAV_HEIGHT = 64;
export const BOTTOM_NAV_BORDER_WIDTH = 1;

/** 底部導覽實際佔用的高度（導覽列 + 上框線 + iOS 安全區域），頁面底部要留出同樣的空間才不會被蓋住。 */
export const BOTTOM_NAV_OFFSET = `calc(${BOTTOM_NAV_HEIGHT + BOTTOM_NAV_BORDER_WIDTH}px + env(safe-area-inset-bottom))`;
