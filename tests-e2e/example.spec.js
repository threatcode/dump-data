import { test, expect } from '@playwright/test';

test.describe('RingID App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/RingID/);

    // Check if main app container exists
    const appContainer = page.locator('#main-app, .app, [ng-app]').first();
    await expect(appContainer).toBeVisible({ timeout: 10000 });
  });

  test('should have login form', async ({ page }) => {
    await page.goto('/');

    // Wait for AngularJS to bootstrap
    await page.waitForTimeout(2000);

    // Check for login elements
    const loginForm = page.locator('form, [ng-controller], .login').first();
    await expect(loginForm).toBeVisible({ timeout: 5000 });
  });

  test('should load without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (err) => !err.includes('favicon') && !err.includes('404')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
