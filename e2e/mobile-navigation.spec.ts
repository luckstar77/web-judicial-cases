import { expect, test } from '@playwright/test';

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
