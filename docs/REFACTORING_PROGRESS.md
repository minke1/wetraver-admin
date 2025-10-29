# 백엔드 통합 리팩토링 진행 현황

**프로젝트**: WETRAVER Admin Dashboard
**브랜치**: `feature/backend-integration-refactoring`
**시작일**: 2025-10-29
**전략**: 2세션 분할 작업 (토큰 절약)

---

## 📌 빠른 시작 가이드 (내일 작업 시)

### 내일 작업을 시작하려면

```bash
# 1. Git 상태 확인
git status
git branch

# 2. 올바른 브랜치에 있는지 확인
# feature/backend-integration-refactoring 브랜치여야 함

# 3. 아니라면 전환
git checkout feature/backend-integration-refactoring

# 4. 최신 상태 확인
git log --oneline -5

# 5. Claude에게 지시
"REFACTORING_PROGRESS.md 읽고 세션 2 작업 계속해줘"
```

---

## 🎯 전체 작업 개요

### 목적
- 현재: Mock 데이터를 컴포넌트에 직접 import
- 목표: API 레이어 → 서비스 레이어 → 컴포넌트 구조로 변경
- 이유: 백엔드 추가 시 서비스 파일만 수정하면 되도록

### 전체 체크포인트 (6단계)

```
✅ CP0: 백업 완료 (main 브랜치)

[세션 1 - 오늘]
⬜ CP1: API 클라이언트 레이어 (20-30분)
⬜ CP2: 공통 UI 컴포넌트 (20-30분)
⬜ CP3: 서비스 레이어 (40-60분)

[세션 2 - 내일]
⬜ CP4: 예약 페이지 리팩토링 (60-90분)
⬜ CP5: 나머지 페이지 리팩토링 (40-60분)
⬜ CP6: 문서화 및 최종 검증 (20-30분)
```

---

## 📅 세션 1 작업 계획 (오늘)

### 체크포인트 1: API 클라이언트 레이어

#### 생성할 파일
1. `lib/api/client.ts` - 기본 API 클라이언트
2. `lib/api/endpoints.ts` - 엔드포인트 상수
3. `types/api.ts` - API 관련 타입
4. `.env.example` - 환경 변수 템플릿

#### 상세 작업 내용

**파일 1: `lib/api/client.ts`**
- API 호출을 위한 기본 함수
- `apiClient()`, `get()`, `post()`, `put()`, `del()`, `patch()` 함수
- 에러 처리 (`ApiError` 클래스)
- Mock 모드 지원 (`NEXT_PUBLIC_USE_MOCK` 환경 변수)
- 전체 코드는 `BACKEND_INTEGRATION_REFACTORING.md` 참고

**파일 2: `lib/api/endpoints.ts`**
- 모든 API 엔드포인트 상수 정의
- `ENDPOINTS.RESERVATIONS`, `ENDPOINTS.PRODUCTS` 등
- 함수형 엔드포인트: `DETAIL: (id) => '/api/reservations/${id}'`

**파일 3: `types/api.ts`**
- `ApiResponse<T>` 인터페이스
- `PaginatedResponse<T>` 인터페이스
- `ApiError` 인터페이스
- `PaginationParams`, `SortParams`, `SearchParams`

**파일 4: `.env.example`**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK=true
API_TIMEOUT=30000
```

#### 검증
```bash
# 디렉토리 생성 확인
ls lib/api
ls types

# 파일 존재 확인
ls lib/api/client.ts
ls lib/api/endpoints.ts
ls types/api.ts
ls .env.example
```

#### 커밋
```bash
git add lib/api types/api.ts .env.example
git commit -m "체크포인트 1: API 클라이언트 레이어 생성"
```

---

### 체크포인트 2: 공통 UI 컴포넌트

#### 생성할 파일
1. `components/ui/loading-spinner.tsx`
2. `components/ui/error-message.tsx`
3. `components/ui/empty-state.tsx`

#### 상세 작업 내용

**파일 1: `components/ui/loading-spinner.tsx`**
```typescript
export function LoadingSpinner() { ... }
export function LoadingSpinnerSmall() { ... }
export function LoadingWithText({ text }) { ... }
```

**파일 2: `components/ui/error-message.tsx`**
```typescript
export function ErrorMessage({ error, retry, title }) { ... }
export function ErrorMessageInline({ error }) { ... }
```

**파일 3: `components/ui/empty-state.tsx`**
```typescript
export function EmptyState({ message, action }) { ... }
```

전체 코드는 `BACKEND_INTEGRATION_REFACTORING.md` STEP 2 참고

#### 검증
```bash
# 파일 존재 확인
ls components/ui/loading-spinner.tsx
ls components/ui/error-message.tsx
ls components/ui/empty-state.tsx
```

#### 커밋
```bash
git add components/ui/loading-spinner.tsx components/ui/error-message.tsx components/ui/empty-state.tsx
git commit -m "체크포인트 2: 공통 UI 컴포넌트 생성"
```

---

### 체크포인트 3: 서비스 레이어

#### 생성할 파일
1. `lib/services/reservationService.ts`
2. `lib/services/productService.ts`
3. `lib/services/memberService.ts`
4. `lib/services/dashboardService.ts`

#### 상세 작업 내용

각 서비스는 다음 패턴을 따름:
```typescript
import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export async function getXXX() { ... }
export async function getXXXById(id) { ... }
export async function createXXX(data) { ... }
export async function updateXXX(id, data) { ... }
export async function deleteXXX(id) { ... }
```

전체 코드는 `BACKEND_INTEGRATION_REFACTORING.md` STEP 3 참고

#### 검증
```bash
# 파일 존재 확인
ls lib/services/reservationService.ts
ls lib/services/productService.ts
ls lib/services/memberService.ts
ls lib/services/dashboardService.ts

# 타입스크립트 컴파일 체크
npm run build
```

#### 커밋 및 푸시
```bash
git add lib/services
git commit -m "체크포인트 3: 서비스 레이어 생성 완료"
git push origin feature/backend-integration-refactoring
```

#### 세션 1 종료 시 업데이트
이 문서 업데이트:
- 완료된 체크포인트 체크 표시
- 다음 세션 시작 포인트 명확히 기록

---

## 📅 세션 2 작업 계획 (내일)

### 시작 전 확인사항

```bash
# 1. 올바른 브랜치인지 확인
git branch
# * feature/backend-integration-refactoring 이어야 함

# 2. 최신 상태 확인
git log --oneline -5
# "체크포인트 3: 서비스 레이어 생성 완료" 커밋이 보여야 함

# 3. 개발 서버 실행 (포트 3007)
npm run dev
```

---

### 체크포인트 4: 예약 페이지 리팩토링

**가장 복잡하고 중요한 작업!**

#### 작업 대상 파일

**수정할 파일**:
1. `app/reservations/travel/page.tsx` (목록 페이지)
2. `app/reservations/travel/[id]/page.tsx` (상세 페이지)

**새로 생성할 파일**:
3. `components/reservations/ReservationForm.tsx`
4. `components/reservations/PaymentInfo.tsx`
5. `components/reservations/VoucherInfo.tsx`
6. `components/reservations/HistoryLog.tsx`

---

#### 4-1. 예약 목록 페이지 리팩토링

**파일**: `app/reservations/travel/page.tsx`

**현재 문제점**:
```typescript
// ❌ 현재
import { mockReservations } from '@/data/mockReservations';
const reservations = mockReservations;
```

**변경할 내용**:
```typescript
// ✅ 변경 후
'use client';
import { useState, useEffect } from 'react';
import { getReservations, getReservationStats } from '@/lib/services/reservationService';

const [reservations, setReservations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  loadData();
}, [currentPage, filters]);

async function loadData() {
  try {
    setLoading(true);
    const data = await getReservations(currentPage, 30, filters);
    setReservations(data.data);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}
```

**상세 변경 단계**:

1. **파일 상단 수정**:
   - `'use client'` 추가
   - useState, useEffect import
   - 서비스 함수 import
   - Mock 데이터 import 제거

2. **상태 관리 추가**:
   ```typescript
   const [reservations, setReservations] = useState<TravelReservation[]>([]);
   const [stats, setStats] = useState<ReservationStats | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [filters, setFilters] = useState<ReservationFilters>({});
   ```

3. **데이터 로드 함수 추가**:
   ```typescript
   async function loadData() {
     try {
       setLoading(true);
       setError(null);

       const [reservationsData, statsData] = await Promise.all([
         getReservations(currentPage, 30, filters),
         getReservationStats(),
       ]);

       setReservations(reservationsData.data);
       setTotalPages(reservationsData.pagination.totalPages);
       setStats(statsData);
     } catch (err) {
       setError(err as Error);
     } finally {
       setLoading(false);
     }
   }
   ```

4. **로딩/에러 처리 추가**:
   ```typescript
   if (loading && !reservations.length) {
     return (
       <DashboardLayout>
         <LoadingSpinner />
       </DashboardLayout>
     );
   }

   if (error) {
     return (
       <DashboardLayout>
         <ErrorMessage error={error} retry={loadData} />
       </DashboardLayout>
     );
   }
   ```

5. **기존 UI 코드는 그대로 유지**:
   - 테이블, 필터, 버튼 등 UI는 변경 없음
   - 데이터 가져오는 방식만 변경

**전체 코드 참고**: `BACKEND_INTEGRATION_REFACTORING.md` STEP 4.1

---

#### 4-2. 예약 상세 페이지 컴포넌트 분리

**문제점**: 현재 778줄로 너무 큼

**해결책**: 4개 컴포넌트로 분리

---

**파일 1: `components/reservations/ReservationForm.tsx`**

```typescript
interface ReservationFormProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function ReservationForm({ data, onChange }: ReservationFormProps) {
  const updateField = (field: keyof TravelReservation, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 예약 기본 정보 폼 */}
      {/* 기존 코드에서 예약정보 테이블 부분만 복사 */}
    </div>
  );
}
```

**포함할 필드**:
- 상품명, 예약번호
- 주문자명, 이메일, 전화번호
- 투숙자명, 성별, 국가
- 호텔명, 객실타입
- 체크인/체크아웃, 숙박일, 객실수
- 성인/어린이/침대, 조식, 프로모션
- 특별요청사항

---

**파일 2: `components/reservations/PaymentInfo.tsx`**

```typescript
interface PaymentInfoProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function PaymentInfo({ data, onChange }: PaymentInfoProps) {
  const updateField = (field: keyof TravelReservation, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 결제 정보 */}
    </div>
  );
}
```

**포함할 필드**:
- 예약 상태 (Select)
- 결제 방법
- 상품금액(원화), 결제금액
- 판매자 정보 (이름, 전화, 이메일)

---

**파일 3: `components/reservations/VoucherInfo.tsx`**

```typescript
interface VoucherInfoProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function VoucherInfo({ data, onChange }: VoucherInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 바우처/인보이스 정보 */}
    </div>
  );
}
```

**포함할 필드**:
- 바우처 발급 상태
- 바우처 발급일
- 인보이스 발급 상태
- 인보이스 발급일

---

**파일 4: `components/reservations/HistoryLog.tsx`**

```typescript
interface HistoryLogProps {
  reservationId: number;
}

export function HistoryLog({ reservationId }: HistoryLogProps) {
  // TODO: 향후 히스토리 API 연동

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">관리 히스토리</h2>
      </div>
      <div className="p-6">
        <span className="text-gray-500">수정 내역이 없습니다.</span>
      </div>
    </div>
  );
}
```

---

**메인 파일: `app/reservations/travel/[id]/page.tsx` 단순화**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getReservationById, updateReservation } from '@/lib/services/reservationService';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { PaymentInfo } from '@/components/reservations/PaymentInfo';
import { VoucherInfo } from '@/components/reservations/VoucherInfo';
import { HistoryLog } from '@/components/reservations/HistoryLog';

export default function TravelReservationDetailPage() {
  const params = useParams();
  const reservationId = Number(params.id);

  const [formData, setFormData] = useState<TravelReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadReservation();
  }, [reservationId]);

  async function loadReservation() {
    try {
      setLoading(true);
      const data = await getReservationById(reservationId);
      setFormData(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData) return;
    try {
      await updateReservation(reservationId, formData);
      toast.success('저장되었습니다.');
    } catch (err) {
      toast.error('저장 실패');
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error || !formData) return <ErrorMessage />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between">
          <h1>예약 상세</h1>
          <Button onClick={handleSave}>저장</Button>
        </div>

        {/* 분리된 컴포넌트들 */}
        <ReservationForm data={formData} onChange={setFormData} />
        <PaymentInfo data={formData} onChange={setFormData} />
        <VoucherInfo data={formData} onChange={setFormData} />
        <HistoryLog reservationId={reservationId} />
      </div>
    </DashboardLayout>
  );
}
```

---

#### 체크포인트 4 검증

```bash
# 1. 타입스크립트 컴파일
npm run build

# 2. 개발 서버 확인 (http://localhost:3007)
# - /reservations/travel - 목록 페이지 로딩 확인
# - /reservations/travel/162 - 상세 페이지 로딩 확인

# 3. 기능 테스트
# - 필터 작동 확인
# - 페이지네이션 확인
# - 데이터 표시 확인

# 4. 콘솔 에러 없는지 확인
# 브라우저 개발자 도구에서 에러 확인
```

#### 커밋
```bash
git add app/reservations components/reservations
git commit -m "체크포인트 4: 예약 페이지 리팩토링 완료"
```

---

### 체크포인트 5: 나머지 페이지 리팩토링

동일한 패턴을 3개 페이지에 적용

---

#### 5-1. 상품 페이지

**파일**: `app/products/page.tsx`

**변경 전**:
```typescript
import { getProducts } from '@/lib/mock-data/products';
const { data, pagination } = getProducts(1, 20);
```

**변경 후**:
```typescript
'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/services/productService';

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  loadData();
}, [currentPage, filters]);

async function loadData() {
  try {
    setLoading(true);
    const data = await getProducts(currentPage, 20, filters);
    setProducts(data.data);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}

// 로딩/에러 처리 추가
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} retry={loadData} />;
```

---

#### 5-2. 회원 페이지

**파일**: `app/members/page.tsx`

**변경 전**:
```typescript
import { getMembers } from '@/lib/mock-data/members';
const { data, pagination } = getMembers(1, 20);
```

**변경 후**:
```typescript
'use client';
import { useState, useEffect } from 'react';
import { getMembers } from '@/lib/services/memberService';

// 상품 페이지와 동일한 패턴
```

---

#### 5-3. 대시보드 페이지

**파일**: `app/dashboard/page.tsx`

**변경 전**:
```typescript
import { mockDashboardStats } from '@/data/mockDashboard';
import { mockRecentReservations } from '@/data/mockReservations';
// ...
```

**변경 후**:
```typescript
'use client';
import { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getDailyRevenue,
  getProductSales,
  getRecentReservations
} from '@/lib/services/dashboardService';

const [stats, setStats] = useState(null);
const [revenue, setRevenue] = useState([]);
const [productSales, setProductSales] = useState([]);
const [recentReservations, setRecentReservations] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();
}, []);

async function loadData() {
  try {
    setLoading(true);
    const [statsData, revenueData, salesData, reservationsData] = await Promise.all([
      getDashboardStats(),
      getDailyRevenue(),
      getProductSales(),
      getRecentReservations(),
    ]);

    setStats(statsData);
    setRevenue(revenueData);
    setProductSales(salesData);
    setRecentReservations(reservationsData);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}
```

---

#### 체크포인트 5 검증

```bash
# 타입스크립트 컴파일
npm run build

# 모든 페이지 확인
# - http://localhost:3007/dashboard
# - http://localhost:3007/products
# - http://localhost:3007/members

# 각 페이지에서 로딩 표시 확인
# 데이터 표시 확인
```

#### 커밋
```bash
git add app/products app/members app/dashboard
git commit -m "체크포인트 5: 나머지 페이지 리팩토링 완료"
```

---

### 체크포인트 6: 문서화 및 최종 검증

---

#### 6-1. API 통합 가이드 작성

**파일**: `docs/API_INTEGRATION_GUIDE.md`

백엔드 개발자를 위한 상세 가이드:

**포함 내용**:
1. 환경 변수 설정 방법
2. 모든 API 엔드포인트 명세
3. 요청/응답 예시
4. 에러 코드 정의
5. 테스팅 방법

전체 내용은 `BACKEND_INTEGRATION_REFACTORING.md` STEP 6.1 참고

---

#### 6-2. README.md 업데이트

**파일**: `README.md`

**추가할 섹션**:

```markdown
## 백엔드 통합

### 환경 변수 설정

`.env.local` 파일 생성:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK=true
\`\`\`

### Mock 모드

백엔드 준비 전까지 Mock 모드로 개발:
- `NEXT_PUBLIC_USE_MOCK=true`: Mock 데이터 사용
- `NEXT_PUBLIC_USE_MOCK=false`: 실제 API 호출

### API 문서

자세한 내용은 `docs/API_INTEGRATION_GUIDE.md` 참고
```

---

#### 6-3. 최종 검증 체크리스트

```bash
# 1. 타입스크립트 컴파일
npm run build
# ✅ 에러 없이 빌드 성공해야 함

# 2. 모든 페이지 로딩 확인
# ✅ http://localhost:3007/dashboard
# ✅ http://localhost:3007/products
# ✅ http://localhost:3007/members
# ✅ http://localhost:3007/reservations/travel
# ✅ http://localhost:3007/reservations/travel/162

# 3. 각 페이지에서 확인
# ✅ 로딩 스피너 표시
# ✅ 데이터 정상 표시
# ✅ 필터/검색 작동
# ✅ 페이지네이션 작동

# 4. 브라우저 콘솔
# ✅ 에러 없음
# ✅ 경고 없음

# 5. Git 상태
# ✅ 모든 변경사항 커밋됨
# ✅ 원격 저장소에 푸시됨
```

---

#### 6-4. SESSION_HISTORY.md 업데이트

**파일**: `docs/SESSION_HISTORY.md`

**추가할 내용**:

```markdown
### 2025-10-29 ~ 2025-10-30 백엔드 통합 리팩토링

#### 완료된 작업
- ✅ API 클라이언트 레이어 생성
- ✅ 공통 UI 컴포넌트 생성
- ✅ 서비스 레이어 생성
- ✅ 예약 페이지 리팩토링 (컴포넌트 분리)
- ✅ 상품/회원/대시보드 페이지 리팩토링
- ✅ API 통합 가이드 작성

#### 변경된 파일
**새로 생성**:
- lib/api/client.ts
- lib/api/endpoints.ts
- types/api.ts
- lib/services/*.ts (4개)
- components/ui/loading-spinner.tsx
- components/ui/error-message.tsx
- components/ui/empty-state.tsx
- components/reservations/*.tsx (4개)
- docs/API_INTEGRATION_GUIDE.md

**수정됨**:
- app/reservations/travel/page.tsx
- app/reservations/travel/[id]/page.tsx
- app/products/page.tsx
- app/members/page.tsx
- app/dashboard/page.tsx
- README.md

#### 주요 변경사항
1. Mock 데이터 직접 import 제거
2. 서비스 레이어를 통한 데이터 조회로 변경
3. 비동기 패턴 적용 (useState, useEffect)
4. 로딩/에러 상태 처리 추가
5. 예약 상세 페이지 4개 컴포넌트로 분리

#### 백엔드 연동 방법
1. `.env.local` 생성
2. `NEXT_PUBLIC_API_URL` 설정
3. `NEXT_PUBLIC_USE_MOCK=false` 설정
4. 백엔드 서버 실행
5. 프론트엔드 서버 재시작

#### 커밋 내역
- d5559ee: 백업 커밋 (main 브랜치)
- [세션1 커밋들]
- [세션2 커밋들]
```

---

#### 최종 커밋 및 푸시

```bash
git add docs/API_INTEGRATION_GUIDE.md docs/SESSION_HISTORY.md README.md
git commit -m "체크포인트 6: 문서화 및 리팩토링 완료"
git push origin feature/backend-integration-refactoring
```

---

#### 6-5. main 브랜치 병합 (선택)

**성공적으로 완료되었다면**:

```bash
# 1. main 브랜치로 전환
git checkout main

# 2. 리팩토링 브랜치 병합
git merge feature/backend-integration-refactoring

# 3. 원격 저장소에 푸시
git push origin main

# 4. 리팩토링 브랜치 삭제 (선택)
git branch -D feature/backend-integration-refactoring
git push origin --delete feature/backend-integration-refactoring
```

---

## 🚨 문제 발생 시 대응

### 문제 1: 빌드 실패

```bash
# 오류 메시지 확인
npm run build

# 타입 오류라면
# → Claude에게 오류 메시지 전달
# → 수정 후 다시 빌드

# 해결 안되면 롤백
git reset --hard HEAD
```

---

### 문제 2: 페이지 로딩 안됨

```bash
# 개발 서버 재시작
# Ctrl+C
npm run dev

# 캐시 삭제 후 재시작
rm -rf .next
npm run dev

# 안되면 이전 커밋으로 롤백
git log --oneline
git reset --hard <정상작동하던커밋ID>
```

---

### 문제 3: Mock 데이터 안나옴

**확인사항**:
1. `.env.local` 파일 존재하는지
2. `NEXT_PUBLIC_USE_MOCK=true` 설정되어 있는지
3. 개발 서버 재시작했는지

```bash
# .env.local 생성
echo "NEXT_PUBLIC_USE_MOCK=true" > .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" >> .env.local

# 서버 재시작
npm run dev
```

---

### 문제 4: 전체 롤백

```bash
# 모든 변경사항 버리고 main으로
git checkout main
git branch -D feature/backend-integration-refactoring

# 처음부터 다시 시작
git checkout -b feature/backend-integration-refactoring
```

---

## 📋 체크리스트 (작업 완료 시 체크)

### 세션 1 (오늘)
- [ ] 체크포인트 1: API 클라이언트 레이어
- [ ] 체크포인트 2: 공통 UI 컴포넌트
- [ ] 체크포인트 3: 서비스 레이어
- [ ] 커밋 및 푸시 완료
- [ ] 이 문서 업데이트

### 세션 2 (내일)
- [ ] 체크포인트 4: 예약 페이지 리팩토링
  - [ ] 목록 페이지 리팩토링
  - [ ] 상세 페이지 리팩토링
  - [ ] ReservationForm 컴포넌트 생성
  - [ ] PaymentInfo 컴포넌트 생성
  - [ ] VoucherInfo 컴포넌트 생성
  - [ ] HistoryLog 컴포넌트 생성
- [ ] 체크포인트 5: 나머지 페이지 리팩토링
  - [ ] 상품 페이지
  - [ ] 회원 페이지
  - [ ] 대시보드 페이지
- [ ] 체크포인트 6: 문서화 및 검증
  - [ ] API_INTEGRATION_GUIDE.md 작성
  - [ ] README.md 업데이트
  - [ ] SESSION_HISTORY.md 업데이트
  - [ ] 최종 검증 완료
- [ ] 모든 커밋 완료 및 푸시
- [ ] main 브랜치 병합 (선택)

---

## 🎓 참고 자료

### 상세 코드 참고
- `docs/BACKEND_INTEGRATION_REFACTORING.md` - 전체 코드와 상세 설명

### 작업 패턴
모든 페이지는 동일한 패턴:

```typescript
'use client';
import { useState, useEffect } from 'react';
import { getXXX } from '@/lib/services/xxxService';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, [deps]);

  async function loadData() {
    try {
      setLoading(true);
      const result = await getXXX();
      setData(result.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} retry={loadData} />;

  return <div>{/* 기존 UI */}</div>;
}
```

---

## 💡 내일 세션 시작 명령어

```bash
# 1. Git 확인
git status
git branch

# 2. 올바른 브랜치로 전환 (필요시)
git checkout feature/backend-integration-refactoring

# 3. 최신 상태 확인
git log --oneline -5

# 4. 개발 서버 실행
npm run dev

# 5. Claude에게
"REFACTORING_PROGRESS.md 읽고 세션 2 작업 계속해줘"
```

---

**문서 작성일**: 2025-10-29
**다음 업데이트**: 세션 1 완료 후
**최종 완료 예정**: 세션 2 완료 후
