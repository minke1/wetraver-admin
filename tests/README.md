# E2E 테스트 가이드

Playwright를 사용한 E2E (End-to-End) 테스트 가이드입니다.

## 설치

Playwright 브라우저가 설치되어 있지 않다면:

```bash
npx playwright install chromium
```

## 테스트 실행

### 1. 기본 테스트 실행 (헤드리스 모드)

```bash
npm test
```

모든 테스트를 백그라운드에서 실행합니다.

### 2. UI 모드로 테스트 실행 (권장)

```bash
npm run test:ui
```

Playwright UI를 통해 테스트를 시각적으로 확인하고 디버깅할 수 있습니다.

### 3. 브라우저를 띄워서 테스트 실행

```bash
npm run test:headed
```

실제 브라우저 창을 보면서 테스트가 실행됩니다.

### 4. 디버그 모드로 테스트 실행

```bash
npm run test:debug
```

한 줄씩 실행하며 디버깅할 수 있습니다.

### 5. 특정 테스트 파일만 실행

```bash
npm test tests/login.spec.ts
```

### 6. 테스트 결과 리포트 보기

```bash
npm run test:report
```

## 테스트 파일 구조

```
tests/
├── login.spec.ts        # 로그인 기능 테스트
├── dashboard.spec.ts    # 대시보드 페이지 테스트
├── products.spec.ts     # 상품 관리 페이지 테스트
└── navigation.spec.ts   # 네비게이션 테스트
```

## 테스트 작성 예제

### describe를 사용한 테스트 그룹화

```typescript
import { test, expect } from '@playwright/test';

test.describe('로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('로그인 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Trenvl');
  });

  test('로그인이 정상적으로 작동한다', async ({ page }) => {
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('/dashboard');
  });
});
```

### 중첩된 describe 사용

```typescript
test.describe('네비게이션 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 공통 로그인 로직
    await page.goto('/');
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin');
    await page.locator('button[type="submit"]').click();
  });

  test.describe('사이드바 메뉴', () => {
    test('대시보드 메뉴 클릭', async ({ page }) => {
      await page.locator('text=대시보드').click();
      await expect(page).toHaveURL('/dashboard');
    });

    test('상품 메뉴 클릭', async ({ page }) => {
      await page.locator('text=상품 관리').click();
      await expect(page).toHaveURL('/products');
    });
  });

  test.describe('헤더 메뉴', () => {
    test('로그아웃', async ({ page }) => {
      await page.locator('button').filter({ hasText: '관리자' }).click();
      await page.locator('text=로그아웃').click();
      await expect(page).toHaveURL('/');
    });
  });
});
```

## 주요 Playwright API

### 페이지 이동
```typescript
await page.goto('/products');
await page.waitForURL('/dashboard');
```

### 요소 찾기
```typescript
page.locator('button')                    // 태그로 찾기
page.locator('text=로그인')                // 텍스트로 찾기
page.locator('input[type="text"]')        // CSS 선택자
page.locator('button').filter({ hasText: '저장' })  // 필터
```

### 액션
```typescript
await element.click()                     // 클릭
await element.fill('텍스트')               // 입력
await element.check()                     // 체크박스 선택
await element.selectOption('옵션')         // 드롭다운 선택
```

### 검증 (Assertions)
```typescript
await expect(page).toHaveURL('/dashboard')
await expect(element).toBeVisible()
await expect(element).toContainText('텍스트')
await expect(element).toHaveValue('값')
```

## 테스트 실행 전 주의사항

1. **개발 서버가 실행 중이어야 합니다**
   - `npm run dev`로 서버를 먼저 실행하거나
   - playwright.config.ts의 webServer 설정이 자동으로 실행합니다

2. **포트 3003 확인**
   - 테스트는 http://localhost:3003을 사용합니다
   - playwright.config.ts에서 포트 변경 가능

3. **Mock 데이터**
   - 모든 테스트는 Mock 데이터를 사용합니다
   - 실제 백엔드 API 연동이 필요 없습니다

## CI/CD 통합

GitHub Actions에서 테스트 실행 예제:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install chromium

- name: Run Playwright tests
  run: npm test

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 트러블슈팅

### 브라우저가 설치되지 않음
```bash
npx playwright install chromium
```

### 테스트가 실패함
1. 개발 서버가 실행 중인지 확인
2. 포트 3003이 사용 가능한지 확인
3. `npm run test:debug`로 디버그 모드 실행

### 타임아웃 에러
playwright.config.ts에서 timeout 값 증가:
```typescript
use: {
  actionTimeout: 10000,
  navigationTimeout: 30000,
}
```
