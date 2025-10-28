import { test, expect } from '@playwright/test';

test.describe('로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('로그인 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Trenvl');
    await expect(page.locator('text=관리자 로그인')).toBeVisible();
  });

  test('아이디와 비밀번호 입력 필드가 존재한다', async ({ page }) => {
    const usernameInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('빈 값으로 로그인 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    // Toast 메시지 대기
    await page.waitForTimeout(1000);
    await expect(page.locator('text=아이디와 비밀번호를 입력해주세요')).toBeVisible({ timeout: 5000 });
  });

  test('잘못된 계정으로 로그인 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.locator('input[type="text"]').fill('wrong');
    await page.locator('input[type="password"]').fill('wrong');
    await page.locator('button[type="submit"]').click();

    // Toast 메시지 대기
    await page.waitForTimeout(1000);
    await expect(page.locator('text=아이디 또는 비밀번호가 올바르지 않습니다')).toBeVisible({ timeout: 5000 });
  });

  test('올바른 계정으로 로그인 시 대시보드로 이동한다', async ({ page }) => {
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin');
    await page.locator('button[type="submit"]').click();

    // 대시보드 페이지 로드 대기 (timeout 증가)
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL('/dashboard');

    // 페이지 컴파일 완료 대기
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('대시보드', { timeout: 10000 });
  });
});
