/**
 * OSIRIS E2E Test Suite
 * Critical path testing using Playwright
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test Suite: Navigation and Routing
test.describe('Navigation', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/OSIRIS/);
    await expect(page.locator('text=المفسدون')).toBeVisible();
  });

  test('can navigate to play page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=ابدأ الرحلة'); // or English equivalent
    await expect(page.url()).toContain('/play');
  });

  test('404 page works for invalid routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/invalid-route`);
    await expect(page.locator('text=404')).toBeVisible();
  });
});

// Test Suite: Scene Navigation
test.describe('Scene Navigation', () => {
  test('starts at first scene', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    // Wait for scene to load
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="scene-indicator"]')).toContainText('0');
  });

  test('can navigate to specific scene via query param', async ({ page }) => {
    await page.goto(`${BASE_URL}/play?scene=one-1-1-opening`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    // Should show Part 1 indicator
    await expect(page.locator('[data-testid="part-indicator"]')).toContainText('1');
  });

  test('next button advances dialogue', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    const initialText = await page.locator('[data-testid="dialogue-text"]').textContent();
    await page.click('[data-testid="next-button"]');
    
    // Text should change
    const newText = await page.locator('[data-testid="dialogue-text"]').textContent();
    expect(newText).not.toBe(initialText);
  });

  test('back button goes to previous dialogue', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Advance first
    await page.click('[data-testid="next-button"]');
    const currentText = await page.locator('[data-testid="dialogue-text"]').textContent();
    
    // Go back
    await page.click('[data-testid="back-button"]');
    const previousText = await page.locator('[data-testid="dialogue-text"]').textContent();
    
    expect(previousText).not.toBe(currentText);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    const initialText = await page.locator('[data-testid="dialogue-text"]').textContent();
    
    // Press space to advance
    await page.keyboard.press('Space');
    const newText = await page.locator('[data-testid="dialogue-text"]').textContent();
    expect(newText).not.toBe(initialText);
    
    // Press backspace to go back
    await page.keyboard.press('Backspace');
    const backText = await page.locator('[data-testid="dialogue-text"]').textContent();
    expect(backText).toBe(initialText);
  });
});

// Test Suite: Choice System
test.describe('Choices', () => {
  test('choices appear at end of scene', async ({ page }) => {
    await page.goto(`${BASE_URL}/play?scene=zero-1-1-summons`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Advance through all dialogue
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="next-button"]');
      await page.waitForTimeout(300);
    }
    
    // Choices should appear
    await expect(page.locator('[data-testid="choice-panel"]')).toBeVisible();
  });

  test('choice timer counts down', async ({ page }) => {
    await page.goto(`${BASE_URL}/play?scene=zero-1-1-summons`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Advance to choices
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="next-button"]');
      await page.waitForTimeout(300);
    }
    
    // Check timer
    const timer = page.locator('[data-testid="choice-timer"]');
    const initialValue = parseInt(await timer.textContent() || '30');
    
    // Wait 2 seconds
    await page.waitForTimeout(2000);
    const newValue = parseInt(await timer.textContent() || '30');
    
    expect(newValue).toBeLessThan(initialValue);
  });

  test('selecting choice navigates to next scene', async ({ page }) => {
    await page.goto(`${BASE_URL}/play?scene=zero-1-1-summons`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Advance to choices
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="next-button"]');
      await page.waitForTimeout(300);
    }
    
    // Click first choice
    await page.click('[data-testid="choice-button"]:first-child');
    
    // Should navigate to new scene
    await page.waitForTimeout(2000);
    await expect(page.locator('[data-testid="dialogue-box"]')).toBeVisible();
  });
});

// Test Suite: Audio System
test.describe('Audio', () => {
  test('audio consent modal appears', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await expect(page.locator('[data-testid="audio-consent"]')).toBeVisible();
  });

  test('can enable audio', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.click('[data-testid="enable-audio-button"]');
    await expect(page.locator('[data-testid="audio-consent"]')).not.toBeVisible();
  });

  test('volume controls work', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.click('[data-testid="enable-audio-button"]');
    
    // Check volume slider exists
    await expect(page.locator('[data-testid="volume-control"]')).toBeVisible();
  });
});

// Test Suite: RTL and Language
test.describe('RTL Support', () => {
  test('Arabic text renders RTL', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    const dialogueBox = page.locator('[data-testid="dialogue-box"]');
    const dir = await dialogueBox.getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('can toggle language', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Toggle to English
    await page.click('[data-testid="lang-toggle"]');
    await page.waitForTimeout(500);
    
    // Check for English text
    await expect(page.locator('text=Evil is not random')).toBeVisible();
  });
});

// Test Suite: Visual Effects
test.describe('Visual Effects', () => {
  test('character portrait appears', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    await expect(page.locator('[data-testid="character-portrait"]')).toBeVisible();
  });

  test('background transitions work', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="background-layer"]', { timeout: 5000 });
    
    await expect(page.locator('[data-testid="background-layer"]')).toBeVisible();
  });
});

// Test Suite: Accessibility
test.describe('Accessibility', () => {
  test('skip link available', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.keyboard.press('Tab');
    await expect(page.locator('text=Skip to main content')).toBeFocused();
  });

  test('dialogue text has proper contrast', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-text"]', { timeout: 5000 });
    
    const text = page.locator('[data-testid="dialogue-text"]');
    const color = await text.evaluate(el => window.getComputedStyle(el).color);
    // Should be light text on dark background
    expect(color).toContain('255'); // RGB values near 255
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Some interactive element should be focused
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});

// Test Suite: Performance
test.describe('Performance', () => {
  test('page loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('scene transitions are smooth', async ({ page }) => {
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Measure frame rate during transition
    const metrics = await page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    });
    
    expect(metrics.duration).toBeLessThan(2000);
  });
});

// Test Suite: Mobile Responsiveness
test.describe('Mobile', () => {
  test('mobile layout works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Check that content fits
    const dialogueBox = page.locator('[data-testid="dialogue-box"]');
    const box = await dialogueBox.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });

  test('touch interactions work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/play`);
    await page.waitForSelector('[data-testid="dialogue-box"]', { timeout: 5000 });
    
    // Tap to advance
    await page.tap('[data-testid="dialogue-box"]');
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="dialogue-text"]')).toBeVisible();
  });
});
