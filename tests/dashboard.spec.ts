import { test, expect } from '@playwright/test';

test.describe('대시보드 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 과정
    await page.goto('/');
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test('대시보드 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('대시보드');
    await expect(page.locator('text=전체 시스템 현황을 한눈에 확인하세요')).toBeVisible();
  });

  test('4개의 통계 카드가 표시된다', async ({ page }) => {
    await expect(page.locator('text=총 매출')).toBeVisible();
    await expect(page.locator('text=총 주문')).toBeVisible();
    await expect(page.locator('text=총 회원')).toBeVisible();
    await expect(page.locator('text=활성 상품')).toBeVisible();
  });

  test('일별 매출 추이 차트가 표시된다', async ({ page }) => {
    await expect(page.locator('text=일별 매출 추이')).toBeVisible();
  });

  test('상품별 판매 현황 차트가 표시된다', async ({ page }) => {
    await expect(page.locator('text=상품별 판매 현황')).toBeVisible();
  });

  test('최근 예약 목록이 표시된다', async ({ page }) => {
    await expect(page.locator('text=최근 예약')).toBeVisible();
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('사이드바 메뉴가 정상적으로 작동한다', async ({ page }) => {
    await page.locator('text=상품 관리').click();
    await page.locator('text=상품 목록').click();
    await page.waitForURL('/products');
    await expect(page).toHaveURL('/products');
  });
});
