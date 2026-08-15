import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('redirects to login when accessing admin unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
