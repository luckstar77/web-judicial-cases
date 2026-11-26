import { expect, test } from '@playwright/test';

test('home → judgment search → judgment detail', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '租屋前，先查一下' })).toBeVisible();

  await page.getByRole('textbox', { name: '輸入姓名查詢判決' }).fill('王大明');
  await page.getByRole('button', { name: '查詢', exact: true }).click();

  await expect(page).toHaveURL(/\/judgments\?keyword=/);
  await expect(page.getByText(/找到 5 筆與「王大明」相關的判決/)).toBeVisible();
  const firstResult = page.getByRole('article').first();
  await expect(firstResult.getByText('法院判決')).toBeVisible();
  await expect(firstResult.locator('mark', { hasText: '王大明' })).toBeVisible();

  await firstResult.getByRole('link').click();

  await expect(page).toHaveURL(/\/judgments\/[^?]+\?keyword=/);
  await expect(page.getByRole('heading', { name: '判決全文' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '判決摘要' })).toBeVisible();
  await expect(page.locator('mark', { hasText: '王大明' }).first()).toBeVisible();
  await expect(page).toHaveTitle(/租屋通/);
});

test('empty judgment search suggests community reports', async ({ page }) => {
  await page.goto('/judgments?keyword=不存在的人');

  await expect(page.getByText('查無「不存在的人」的判決紀錄')).toBeVisible();
  await expect(page.getByRole('button', { name: '搜尋網友回報' })).toBeVisible();
});
