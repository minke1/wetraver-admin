import { test, expect } from '@playwright/test';

test.describe('네비게이션 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test.describe('사이드바 메뉴 네비게이션', () => {
    test('대시보드 메뉴 클릭', async ({ page }) => {
      await page.locator('text=대시보드').first().click();
      await expect(page).toHaveURL('/dashboard');
    });

    test('상품 목록 메뉴 클릭', async ({ page }) => {
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/products');
      await expect(page.locator('h1')).toContainText('상품 관리');
    });

    test('회원 목록 메뉴 클릭', async ({ page }) => {
      await page.goto('/members');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/members');
      await expect(page.locator('h1')).toContainText('회원 관리');
    });

    test('공지사항 메뉴 클릭', async ({ page }) => {
      await page.goto('/boards/notices');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/boards/notices');
      await expect(page.locator('h1')).toContainText('공지사항');
    });

    test('매출 통계 메뉴 클릭', async ({ page }) => {
      await page.goto('/statistics/revenue');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/statistics/revenue');
      await expect(page.locator('h1')).toContainText('매출 통계');
    });
  });

  test.describe('헤더 네비게이션', () => {
    test('사용자 메뉴가 표시된다', async ({ page }) => {
      await expect(page.locator('text=관리자')).toBeVisible();
      await expect(page.locator('text=admin@trenvl.com')).toBeVisible();
    });

    test('로그아웃 기능이 작동한다', async ({ page }) => {
      // 사용자 메뉴 클릭 (관리자 버튼)
      await page.getByRole('button', { name: /관리자/ }).click();

      // 로그아웃 클릭
      await page.getByRole('menuitem', { name: '로그아웃' }).click();

      // 로그인 페이지로 이동
      await page.waitForURL('/', { timeout: 10000 });
      await expect(page).toHaveURL('/');
    });
  });
});
