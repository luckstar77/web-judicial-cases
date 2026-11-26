import { expect, type Page, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

test('mobile bottom navigation switches between main sections', async ({ page }) => {
  await page.goto('/');

  const bottomNav = page.getByRole('navigation', { name: '底部導覽' });
  await expect(bottomNav).toBeVisible();
  await expect(page.getByRole('navigation', { name: '主要導覽' })).toBeHidden();

  await bottomNav.getByRole('link', { name: '判決' }).click();
  await expect(page).toHaveURL(/\/judgments$/);
  await expect(page.getByRole('heading', { name: '判決查詢', level: 1 })).toBeVisible();

  await bottomNav.getByRole('link', { name: '回報' }).click();
  await expect(page).toHaveURL(/\/cases$/);
  await expect(page.getByRole('heading', { name: '網友回報', level: 1 })).toBeVisible();

  await bottomNav.getByRole('link', { name: '首頁' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: '租屋前，先查一下' })).toBeVisible();

  await bottomNav.getByRole('link', { name: '我的' }).click();
  await expect(page).toHaveURL(/\/me$/);
  await expect(page.getByRole('dialog')).toBeVisible();
});

/** iPhone 瀏海 / Home indicator 的安全區域（以 Chromium CDP 模擬 env(safe-area-inset-*)）。 */
const SAFE_AREA_INSETS = { top: 47, bottom: 34, left: 0, right: 0 };
/** 捲到底時 scrollTop 是整數、版面高度可能有小數，允許不到 1px 的次像素誤差。 */
const SUBPIXEL_TOLERANCE_PX = 1;

const PAGES_TO_CHECK = [
  { path: '/', ready: (page: Page) => page.getByRole('heading', { name: '租屋前，先查一下' }) },
  { path: '/judgments?keyword=王大明', ready: (page: Page) => page.getByText(/找到 5 筆與「王大明」相關的判決/) },
  { path: '/cases', ready: (page: Page) => page.getByRole('article').first() },
];

const measureBottomOfPage = (page: Page) =>
  page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    const nav = document.querySelector('nav[aria-label="底部導覽"]');
    const footer = document.querySelector('footer');
    if (!nav || !footer) {
      throw new Error('bottom nav or footer not found');
    }
    const shell = footer.parentElement ?? document.body;
    return {
      overlap: footer.getBoundingClientRect().bottom - nav.getBoundingClientRect().top,
      navHeight: nav.getBoundingClientRect().height,
      reservedBottomSpace: Number.parseFloat(getComputedStyle(shell).paddingBottom),
      navPaddingBottom: getComputedStyle(nav).paddingBottom,
    };
  });

test('footer stays fully visible above the fixed bottom navigation, including the iOS safe area', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: SAFE_AREA_INSETS });

  await page.goto('/cases');
  const caseDetailPath = await page.getByRole('article').first().getByRole('link').first().getAttribute('href');
  const pages = [...PAGES_TO_CHECK, { path: caseDetailPath ?? '/cases', ready: (target: Page) => target.getByRole('heading', { name: '對象資訊' }) }];

  for (const target of pages) {
    await page.goto(target.path);
    await expect(target.ready(page)).toBeVisible();

    // 圖片等內容載入後頁面可能變高，每次都重新捲到底再量
    await expect
      .poll(async () => (await measureBottomOfPage(page)).overlap, { message: `footer overlaps bottom nav on ${target.path}` })
      .toBeLessThan(SUBPIXEL_TOLERANCE_PX);
    const { navHeight, reservedBottomSpace, navPaddingBottom } = await measureBottomOfPage(page);
    expect(navPaddingBottom).toBe(`${SAFE_AREA_INSETS.bottom}px`);
    expect(reservedBottomSpace, 'page must reserve at least the full bottom nav height (bar + border + safe area)').toBeGreaterThanOrEqual(navHeight);
    await expect(page.locator('footer').getByText(/資訊互通、風險減少/)).toBeInViewport();
  }
});
