import { expect, test } from '@playwright/test';

test('cases feed → load more → case detail', async ({ page }) => {
  await page.goto('/cases');

  await expect(page.getByRole('heading', { name: '網友回報', level: 1 })).toBeVisible();
  const cards = page.getByRole('article');
  await expect(cards).toHaveCount(10);

  await page.getByRole('button', { name: '載入更多' }).click();
  await expect(cards).toHaveCount(14);
  await expect(page.getByText('已經到底囉，共 14 則')).toBeVisible();

  const firstCard = cards.first();
  const title = await firstCard.getByRole('heading').innerText();
  await firstCard.getByRole('link').click();

  await expect(page).toHaveURL(/\/cases\/\d+$/);
  await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: '對象資訊' })).toBeVisible();
  await expect(page.getByText('網友回報・未經查證').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /留言討論/ })).toBeVisible();
});

test('city chip filters the feed', async ({ page }) => {
  await page.goto('/cases');

  await page.getByRole('button', { name: '台中市' }).click();

  await expect(page).toHaveURL(/city=/);
  const cards = page.getByRole('article');
  await expect(cards.first()).toBeVisible();
  for (const card of await cards.all()) {
    await expect(card).toContainText('台中市');
  }
});
