import { expect, test } from '@playwright/test';

const DEMO_PHONE = '0912345678';
const DEMO_PASSWORD = 'password123';

test('report form explains an image whose content does not match its type', async ({ page }) => {
  await page.goto('/cases/new');

  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('手機號碼').fill(DEMO_PHONE);
  await dialog.getByLabel('密碼', { exact: true }).fill(DEMO_PASSWORD);
  await dialog.getByRole('button', { name: '登入', exact: true }).click();
  await expect(dialog).toBeHidden();

  await page.getByLabel('對象姓名').fill('王大明');
  await page.getByRole('button', { name: '下一步' }).click();

  await page.getByRole('combobox', { name: '縣市' }).click();
  await page.getByRole('option', { name: '台北市' }).click();
  await page.getByRole('combobox', { name: '行政區' }).click();
  await page.getByRole('option', { name: '大安區' }).click();
  await page.getByLabel('月租金').fill('18000');
  await page.getByRole('button', { name: '下一步' }).click();

  await page.getByLabel('標題').fill('房客欠租三個月');
  await page.getByLabel('事件經過').fill('連續三個月未繳房租。');
  await page.getByRole('button', { name: '下一步' }).click();

  // 副檔名與 Content-Type 是 PNG，但內容是純文字：前端放行，後端（mock 同規則）以 magic bytes 擋下
  await page.getByTestId('image-input').setInputFiles({ name: 'evidence.png', mimeType: 'image/png', buffer: Buffer.from('this is not really a png') });
  await expect(page.getByRole('button', { name: '移除 evidence.png' })).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: '發布回報' }).click();

  await expect(page.getByRole('alert').filter({ hasText: '第 1 張圖片的檔案內容不是有效的圖片' })).toBeVisible();
  await expect(page).toHaveURL(/\/cases\/new$/);
});
