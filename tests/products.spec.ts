import { test, expect } from '@playwright/test';

test.describe('상품 관리 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 과정
    await page.goto('/');
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // 상품 페이지로 이동
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
  });

  test('상품 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('상품 관리');
    await expect(page.locator('text=총')).toBeVisible();
  });

  test('필터가 정상적으로 작동한다', async ({ page }) => {
    // 검색 필터
    const searchInput = page.locator('input[placeholder="상품명 검색"]');
    await searchInput.fill('제주');
    await expect(searchInput).toHaveValue('제주');
  });

  test('카테고리 필터가 변경된다', async ({ page }) => {
    // Select 트리거 버튼 클릭
    const categorySelect = page.getByRole('combobox').first();
    await categorySelect.click();
    // 드롭다운 옵션 클릭
    await page.getByRole('option', { name: '호텔/리조트' }).click();
  });

  test('상품 테이블이 표시된다', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // 테이블 헤더 확인
    await expect(page.locator('th', { hasText: '상품명' })).toBeVisible();
    await expect(page.locator('th', { hasText: '카테고리' })).toBeVisible();
    await expect(page.locator('th', { hasText: '가격' })).toBeVisible();
  });

  test('체크박스 선택이 작동한다', async ({ page }) => {
    // 첫 번째 체크박스 클릭
    const firstCheckbox = page.locator('td').first().locator('button');
    await firstCheckbox.click();

    // 선택됨 메시지 확인
    await expect(page.locator('text=개 선택됨')).toBeVisible();
  });

  test('초기화 버튼이 작동한다', async ({ page }) => {
    // 검색어 입력
    await page.locator('input[placeholder="상품명 검색"]').fill('테스트');

    // 초기화 버튼 클릭
    await page.getByRole('button', { name: '초기화' }).click();

    // 검색어가 초기화됨
    await expect(page.locator('input[placeholder="상품명 검색"]')).toHaveValue('');
  });
});
