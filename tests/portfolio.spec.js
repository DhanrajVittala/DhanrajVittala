const { test, expect } = require('@playwright/test');

test('portfolio title and primary navigation render', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/QA Engineer Portfolio/);
  await expect(page.locator('nav.nav')).toBeVisible();
  await expect(page.locator('.navlinks a[href="automation.html"]')).toHaveAttribute('href', 'automation.html');
});

test('portfolio links to the interactive QA lab', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /OPEN INTERACTIVE QA LAB/ }).click();
  await expect(page).toHaveURL(/qa-lab\.html$/);
  await expect(page.getByRole('heading', { name: /QA command center/i })).toBeVisible();
});

test('automation showcase page displays report explorer', async ({ page }) => {
  await page.goto('/automation.html');
  await expect(page).toHaveTitle(/Playwright Automation & CI/);
  await expect(page.getByRole('heading', { name: /Execution snapshot/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'FAILED' })).toBeVisible();
});

test('resume page is available from the portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /RESUME/ }).first()).toHaveAttribute('href', 'resume.html');
  const response = await page.request.get('/resume.html');
  expect(response.ok()).toBeTruthy();
});

test('portfolio does not overflow a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(375);
});

test('report explorer filters sample test rows', async ({ page }) => {
  await page.goto('/automation.html');
  await page.getByRole('button', { name: 'FAILED' }).click();
  await expect(page.locator('#run-rows tr')).toHaveCount(1);
  await expect(page.locator('#run-rows')).toContainText('FAILED');
});
