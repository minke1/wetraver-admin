# 백엔드 통합을 위한 리팩토링 가이드

**작성일**: 2025-10-29
**프로젝트**: WETRAVER Admin Dashboard
**목적**: 백엔드 API 통합을 쉽게 하기 위한 코드 구조 개선

---

## 목차

1. [현재 문제점 분석](#현재-문제점-분석)
2. [리팩토링 개요](#리팩토링-개요)
3. [작업 순서](#작업-순서)
4. [상세 구현 가이드](#상세-구현-가이드)
5. [체크리스트](#체크리스트)

---

## 현재 문제점 분석

### 🔴 Critical Issues

#### 1. Mock 데이터가 컴포넌트에 직접 임포트
**문제가 있는 파일들:**
- `app/reservations/travel/page.tsx` (Line 17)
- `app/reservations/travel/[id]/page.tsx` (Line 18)
- `app/products/page.tsx` (Line 5)
- `app/members/page.tsx` (Line 5)
- `app/dashboard/page.tsx` (Lines 4-9)

**문제점:**
```typescript
// ❌ 나쁜 예 (현재)
import { mockReservations } from '@/data/mockReservations';

export default function Page() {
  const reservations = mockReservations; // 동기적, 정적 데이터
  return <div>...</div>;
}
```

**왜 문제인가?**
- 백엔드 API로 교체하려면 모든 컴포넌트를 수정해야 함
- 비동기 처리 패턴이 없음
- 로딩/에러 상태 처리 불가능

#### 2. API 추상화 레이어 없음
**현재 상태:**
- `lib/api/` 디렉토리 없음
- `lib/services/` 디렉토리 없음
- fetch/axios 래퍼 없음

**문제점:**
- API 호출을 어디에 작성해야 할지 불명확
- 중복 코드 발생 가능
- 에러 처리 패턴 일관성 없음

#### 3. 비동기 데이터 처리 패턴 누락
**현재:**
```typescript
const { data } = getProducts(1, 20); // 동기 함수
```

**필요:**
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchProducts().then(setData);
}, []);
```

### 🟡 Important Issues

#### 4. 중복된 Mock 데이터 소스
- `/data/mockReservations.ts` - 정적 배열 (23개)
- `/lib/mock-data/reservations.ts` - 동적 생성 함수 (162개)
- 타입도 다름: `TravelReservation` vs `Reservation`

#### 5. 로딩/에러 상태 없음
- API 호출 중 사용자 피드백 없음
- 에러 발생 시 처리 방법 없음

#### 6. 거대한 컴포넌트
- `app/reservations/travel/[id]/page.tsx` - 778줄
- 유지보수 어려움

---

## 리팩토링 개요

### 목표
1. **백엔드 통합 용이성**: API로 쉽게 교체 가능한 구조
2. **초보자 친화성**: 명확한 패턴과 가이드
3. **일관성**: 모든 페이지가 같은 패턴 사용
4. **유지보수성**: 작고 이해하기 쉬운 코드

### 핵심 변경사항
1. API 클라이언트 레이어 생성
2. 서비스 레이어 생성 (비즈니스 로직 분리)
3. 컴포넌트를 비동기 데이터 처리 패턴으로 변경
4. 공통 UI 컴포넌트 추가 (로딩, 에러)
5. 큰 컴포넌트 분리

---

## 작업 순서

### Phase 1: 인프라 구축 (1.5~2시간)
1. ✅ API 클라이언트 생성
2. ✅ 타입 정의
3. ✅ 환경 변수 설정
4. ✅ 공통 컴포넌트

### Phase 2: 서비스 레이어 (1~1.5시간)
1. ✅ reservationService
2. ✅ productService
3. ✅ memberService
4. ✅ dashboardService

### Phase 3: 페이지 리팩토링 (3~4시간)
1. ✅ 예약 목록 페이지
2. ✅ 예약 상세 페이지 (분리 포함)
3. ✅ 상품 페이지
4. ✅ 회원 페이지
5. ✅ 대시보드

### Phase 4: 문서화 (30분~1시간)
1. ✅ API 통합 가이드
2. ✅ 코드 주석
3. ✅ README 업데이트

---

## 상세 구현 가이드

---

### STEP 1: API 클라이언트 생성

#### 1.1 디렉토리 생성
```bash
mkdir -p lib/api
mkdir -p lib/services
```

#### 1.2 API 클라이언트 작성

**파일: `lib/api/client.ts`**

```typescript
/**
 * API 클라이언트 - 모든 API 호출의 기본 레이어
 *
 * 사용 예시:
 * const data = await apiClient<User[]>('/api/users');
 */

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * API 응답 공통 인터페이스
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * 페이지네이션 응답 인터페이스
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 기본 API 클라이언트 함수
 *
 * @param endpoint - API 엔드포인트 (예: '/api/users')
 * @param options - fetch 옵션
 * @returns API 응답 데이터
 * @throws {ApiError} API 호출 실패 시
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // 필요시 인증 토큰 추가
        // 'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
      ...options,
    });

    // HTTP 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.code || 'UNKNOWN_ERROR',
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData.details
      );
    }

    // 응답 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    // 네트워크 에러 처리
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      0,
      'NETWORK_ERROR',
      error instanceof Error ? error.message : '네트워크 연결을 확인해주세요.'
    );
  }
}

/**
 * GET 요청
 */
export async function get<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET' });
}

/**
 * POST 요청
 */
export async function post<T>(endpoint: string, data: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청
 */
export async function put<T>(endpoint: string, data: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 */
export async function del<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' });
}

/**
 * PATCH 요청
 */
export async function patch<T>(endpoint: string, data: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
```

#### 1.3 엔드포인트 상수 정의

**파일: `lib/api/endpoints.ts`**

```typescript
/**
 * API 엔드포인트 상수
 *
 * 중앙에서 관리하여 변경 시 한 곳만 수정
 */

export const ENDPOINTS = {
  // 예약 관련
  RESERVATIONS: {
    LIST: '/api/reservations',
    DETAIL: (id: number) => `/api/reservations/${id}`,
    CREATE: '/api/reservations',
    UPDATE: (id: number) => `/api/reservations/${id}`,
    DELETE: (id: number) => `/api/reservations/${id}`,
    STATS: '/api/reservations/stats',
  },

  // 상품 관련
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
  },

  // 회원 관련
  MEMBERS: {
    LIST: '/api/members',
    DETAIL: (id: string) => `/api/members/${id}`,
    CREATE: '/api/members',
    UPDATE: (id: string) => `/api/members/${id}`,
    DELETE: (id: string) => `/api/members/${id}`,
  },

  // 대시보드 관련
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    REVENUE: '/api/dashboard/revenue',
    PRODUCT_SALES: '/api/dashboard/product-sales',
    RECENT_RESERVATIONS: '/api/dashboard/recent-reservations',
  },
} as const;
```

#### 1.4 타입 정의 추가

**파일: `types/api.ts`**

```typescript
/**
 * API 관련 공용 타입 정의
 */

// 기본 API 응답
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiError;
}

// API 에러
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 페이지네이션 파라미터
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 정렬 파라미터
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 검색 파라미터
export interface SearchParams {
  query?: string;
  searchType?: string;
}
```

#### 1.5 환경 변수 설정

**파일: `.env.example`**

```bash
# API Configuration
# 백엔드 API의 기본 URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# API 타임아웃 (밀리초)
API_TIMEOUT=30000

# Mock 모드 사용 여부 (개발 시 true로 설정 가능)
NEXT_PUBLIC_USE_MOCK=false

# 선택사항: API 인증 키
# API_KEY=your-api-key-here
```

**파일: `.env.local` (실제 사용, git에 추가 안 함)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK=false
```

**파일: `.gitignore` 확인**

```
# 이미 있는지 확인, 없으면 추가
.env.local
.env*.local
```

---

### STEP 2: 공통 UI 컴포넌트

#### 2.1 로딩 스피너

**파일: `components/ui/loading-spinner.tsx`**

```typescript
/**
 * 로딩 스피너 컴포넌트
 *
 * 사용 예시:
 * if (loading) return <LoadingSpinner />;
 */

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
}

/**
 * 작은 로딩 스피너 (버튼 안 등에 사용)
 */
export function LoadingSpinnerSmall() {
  return (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
  );
}

/**
 * 텍스트와 함께 표시되는 로딩
 */
export function LoadingWithText({ text = '로딩 중...' }: { text?: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
```

#### 2.2 에러 메시지

**파일: `components/ui/error-message.tsx`**

```typescript
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

/**
 * 에러 메시지 컴포넌트
 *
 * 사용 예시:
 * if (error) return <ErrorMessage error={error} retry={loadData} />;
 */

interface ErrorMessageProps {
  error: string | Error;
  retry?: () => void;
  title?: string;
}

export function ErrorMessage({ error, retry, title = '오류가 발생했습니다' }: ErrorMessageProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
        <p className="text-red-700 mb-4">{errorMessage}</p>
        {retry && (
          <Button onClick={retry} variant="outline">
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 작은 인라인 에러 메시지
 */
export function ErrorMessageInline({ error }: { error: string | Error }) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
      {errorMessage}
    </div>
  );
}
```

#### 2.3 빈 상태 컴포넌트

**파일: `components/ui/empty-state.tsx`**

```typescript
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 빈 상태 컴포넌트
 *
 * 사용 예시:
 * if (data.length === 0) return <EmptyState message="데이터가 없습니다" />;
 */

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
      <FileQuestion className="h-16 w-16 text-gray-400 mb-4" />
      <p className="text-gray-600 mb-4">{message}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

### STEP 3: 서비스 레이어 생성

#### 3.1 예약 서비스

**파일: `lib/services/reservationService.ts`**

```typescript
/**
 * 예약 관련 API 서비스
 *
 * 모든 예약 관련 API 호출을 여기서 관리
 */

import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type {
  TravelReservation,
  ReservationFilters,
  ReservationStats
} from '@/types/reservation';

/**
 * 예약 목록 조회
 *
 * @param page - 페이지 번호 (1부터 시작)
 * @param limit - 페이지당 항목 수
 * @param filters - 필터 조건
 * @returns 페이지네이션된 예약 목록
 *
 * @example
 * const { data, pagination } = await getReservations(1, 20, {
 *   status: '예약완료'
 * });
 */
export async function getReservations(
  page: number = 1,
  limit: number = 20,
  filters?: ReservationFilters
): Promise<PaginatedResponse<TravelReservation>> {
  // 쿼리 파라미터 구성
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // 필터 추가
  if (filters) {
    if (filters.category) params.append('category', filters.category);
    if (filters.statuses?.length) {
      filters.statuses.forEach(status => params.append('status', status));
    }
    if (filters.paymentMethods?.length) {
      filters.paymentMethods.forEach(method => params.append('paymentMethod', method));
    }
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.searchQuery) params.append('q', filters.searchQuery);
    if (filters.searchType) params.append('searchType', filters.searchType);
  }

  return get<PaginatedResponse<TravelReservation>>(
    `${ENDPOINTS.RESERVATIONS.LIST}?${params.toString()}`
  );
}

/**
 * 예약 상세 조회
 *
 * @param id - 예약 ID
 * @returns 예약 상세 정보
 *
 * @example
 * const reservation = await getReservationById(123);
 */
export async function getReservationById(
  id: number
): Promise<TravelReservation> {
  return get<TravelReservation>(ENDPOINTS.RESERVATIONS.DETAIL(id));
}

/**
 * 예약 생성
 *
 * @param data - 예약 데이터
 * @returns 생성된 예약
 *
 * @example
 * const newReservation = await createReservation({
 *   productName: '호텔 예약',
 *   customerName: '홍길동',
 *   // ...
 * });
 */
export async function createReservation(
  data: Omit<TravelReservation, 'id' | 'createdAt'>
): Promise<TravelReservation> {
  return post<TravelReservation>(ENDPOINTS.RESERVATIONS.CREATE, data);
}

/**
 * 예약 수정
 *
 * @param id - 예약 ID
 * @param data - 수정할 데이터 (부분 수정 가능)
 * @returns 수정된 예약
 *
 * @example
 * const updated = await updateReservation(123, {
 *   status: '예약확정',
 *   adminMemo: '확인 완료'
 * });
 */
export async function updateReservation(
  id: number,
  data: Partial<TravelReservation>
): Promise<TravelReservation> {
  return put<TravelReservation>(ENDPOINTS.RESERVATIONS.UPDATE(id), data);
}

/**
 * 예약 삭제
 *
 * @param id - 예약 ID
 *
 * @example
 * await deleteReservation(123);
 */
export async function deleteReservation(id: number): Promise<void> {
  return del<void>(ENDPOINTS.RESERVATIONS.DELETE(id));
}

/**
 * 예약 통계 조회
 *
 * @returns 예약 상태별 통계
 *
 * @example
 * const stats = await getReservationStats();
 * console.log(stats.예약완료); // 15
 */
export async function getReservationStats(): Promise<ReservationStats> {
  return get<ReservationStats>(ENDPOINTS.RESERVATIONS.STATS);
}
```

#### 3.2 상품 서비스

**파일: `lib/services/productService.ts`**

```typescript
/**
 * 상품 관련 API 서비스
 */

import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { Product, ProductFilters } from '@/types/product';

export async function getProducts(
  page: number = 1,
  limit: number = 20,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.searchTerm) {
      params.append('q', filters.searchTerm);
    }
  }

  return get<PaginatedResponse<Product>>(
    `${ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
  );
}

export async function getProductById(id: string): Promise<Product> {
  return get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id));
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<Product> {
  return post<Product>(ENDPOINTS.PRODUCTS.CREATE, data);
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  return put<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  return del<void>(ENDPOINTS.PRODUCTS.DELETE(id));
}
```

#### 3.3 회원 서비스

**파일: `lib/services/memberService.ts`**

```typescript
/**
 * 회원 관련 API 서비스
 */

import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { Member, MemberFilters } from '@/types/member';

export async function getMembers(
  page: number = 1,
  limit: number = 20,
  filters?: MemberFilters
): Promise<PaginatedResponse<Member>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    if (filters.grade && filters.grade !== 'all') {
      params.append('grade', filters.grade);
    }
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.searchTerm) {
      params.append('q', filters.searchTerm);
    }
  }

  return get<PaginatedResponse<Member>>(
    `${ENDPOINTS.MEMBERS.LIST}?${params.toString()}`
  );
}

export async function getMemberById(id: string): Promise<Member> {
  return get<Member>(ENDPOINTS.MEMBERS.DETAIL(id));
}

export async function updateMember(
  id: string,
  data: Partial<Member>
): Promise<Member> {
  return put<Member>(ENDPOINTS.MEMBERS.UPDATE(id), data);
}
```

#### 3.4 대시보드 서비스

**파일: `lib/services/dashboardService.ts`**

```typescript
/**
 * 대시보드 관련 API 서비스
 */

import { get } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
  DashboardStats,
  DailyRevenue,
  ProductSales,
} from '@/types/dashboard';
import type { TravelReservation } from '@/types/reservation';

export async function getDashboardStats(): Promise<DashboardStats> {
  return get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS);
}

export async function getDailyRevenue(
  startDate?: string,
  endDate?: string
): Promise<DailyRevenue[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return get<DailyRevenue[]>(
    `${ENDPOINTS.DASHBOARD.REVENUE}?${params.toString()}`
  );
}

export async function getProductSales(): Promise<ProductSales[]> {
  return get<ProductSales[]>(ENDPOINTS.DASHBOARD.PRODUCT_SALES);
}

export async function getRecentReservations(): Promise<TravelReservation[]> {
  return get<TravelReservation[]>(ENDPOINTS.DASHBOARD.RECENT_RESERVATIONS);
}
```

---

### STEP 4: 페이지 컴포넌트 리팩토링

#### 4.1 예약 목록 페이지

**파일: `app/reservations/travel/page.tsx`**

**변경 전 (현재):**
```typescript
import { mockReservations, mockReservationStats } from '@/data/mockReservations';

export default function TravelReservationsPage() {
  const reservations = mockReservations;
  // ...
}
```

**변경 후:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { EmptyState } from '@/components/ui/empty-state';
import {
  getReservations,
  getReservationStats
} from '@/lib/services/reservationService';
import type {
  TravelReservation,
  ReservationFilters,
  ReservationStats
} from '@/types/reservation';
// ... 기타 imports

export default function TravelReservationsPage() {
  // 상태 관리
  const [reservations, setReservations] = useState<TravelReservation[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ReservationFilters>({});

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, [currentPage, filters]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      // 예약 목록과 통계를 병렬로 가져오기
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

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: Partial<ReservationFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  };

  // 검색 핸들러
  const handleSearch = () => {
    loadData();
  };

  // 로딩 중
  if (loading && !reservations.length) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage error={error} retry={loadData} />
      </DashboardLayout>
    );
  }

  // 데이터 없음
  if (!loading && reservations.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          message="예약 내역이 없습니다"
          action={{
            label: '새로고침',
            onClick: loadData
          }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 기존 UI 코드 유지 */}
        {/* 통계 섹션 */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(stats)
              .filter(([status]) => !['예약가능', '예약확정', '예약불가'].includes(status))
              .map(([status, amount]) => (
                <div key={status} className="text-center">
                  <div className="text-sm text-gray-600 mb-1">{status}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {amount.toLocaleString()}원
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 필터 섹션 - 기존 UI 유지, handleFilterChange 사용 */}

        {/* 테이블 섹션 - 기존 UI 유지 */}

        {/* 페이지네이션 */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            이전
          </Button>
          <span className="flex items-center px-4">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
          >
            다음
          </Button>
        </div>

        {/* 로딩 오버레이 (데이터 새로고침 시) */}
        {loading && reservations.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
```

#### 4.2 예약 상세 페이지 - 큰 컴포넌트 분리

**Step 1: 메인 페이지 단순화**

**파일: `app/reservations/travel/[id]/page.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

import { ReservationForm } from '@/components/reservations/ReservationForm';
import { PaymentInfo } from '@/components/reservations/PaymentInfo';
import { VoucherInfo } from '@/components/reservations/VoucherInfo';
import { HistoryLog } from '@/components/reservations/HistoryLog';

import {
  getReservationById,
  updateReservation,
  deleteReservation,
} from '@/lib/services/reservationService';
import type { TravelReservation } from '@/types/reservation';

export default function TravelReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = Number(params.id);

  const [formData, setFormData] = useState<TravelReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 데이터 로드
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

  // 저장 핸들러
  async function handleSave() {
    if (!formData) return;

    try {
      setSaving(true);
      await updateReservation(reservationId, formData);
      toast.success('저장되었습니다.');
      router.refresh();
    } catch (err) {
      toast.error('저장에 실패했습니다.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // 삭제 핸들러
  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteReservation(reservationId);
      toast.success('삭제되었습니다.');
      router.push('/reservations/travel');
    } catch (err) {
      toast.error('삭제에 실패했습니다.');
      console.error(err);
    }
  }

  // 로딩 중
  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // 에러 또는 데이터 없음
  if (error || !formData) {
    return (
      <DashboardLayout>
        <ErrorMessage
          error={error || new Error('예약을 찾을 수 없습니다.')}
          retry={loadReservation}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">예약 상세</h1>
            <p className="text-sm text-gray-500 mt-1">
              예약 정보를 확인하고 수정합니다
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/reservations/travel">
                <ArrowLeft className="h-4 w-4 mr-2" />
                리스트
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? '저장 중...' : '수정'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>

        {/* 예약 정보 폼 */}
        <ReservationForm
          data={formData}
          onChange={setFormData}
        />

        {/* 결제 정보 */}
        <PaymentInfo
          data={formData}
          onChange={setFormData}
        />

        {/* 바우처/인보이스 */}
        <VoucherInfo
          data={formData}
          onChange={setFormData}
        />

        {/* 히스토리 */}
        <HistoryLog
          reservationId={reservationId}
        />

        {/* 하단 액션 버튼 */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/reservations/travel">
              <ArrowLeft className="h-4 w-4 mr-2" />
              리스트
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? '저장 중...' : '수정'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

**Step 2: 분리된 컴포넌트 생성**

**파일: `components/reservations/ReservationForm.tsx`**

```typescript
/**
 * 예약 기본 정보 폼 컴포넌트
 */

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { TravelReservation } from '@/types/reservation';

interface ReservationFormProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function ReservationForm({ data, onChange }: ReservationFormProps) {
  const updateField = (field: keyof TravelReservation, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          예약정보 ({data.productCategory})
        </h2>
      </div>
      <div className="p-6">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-200">
            {/* 상품명, 예약번호 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                상품명
              </td>
              <td className="py-3 px-4 w-1/3">
                <Input
                  value={data.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                />
              </td>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                예약번호
              </td>
              <td className="py-3 px-4 w-1/3">
                <span className="text-gray-900">{data.reservationNumber}</span>
              </td>
            </tr>

            {/* 주문자명, 이메일 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                주문자명
              </td>
              <td className="py-3 px-4">
                <Input
                  value={data.customerName}
                  onChange={(e) => updateField('customerName', e.target.value)}
                />
              </td>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                주문자 이메일
              </td>
              <td className="py-3 px-4">
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </td>
            </tr>

            {/* 나머지 필드들... */}
            {/* 기존 코드에서 복사하되, updateField 사용 */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**파일: `components/reservations/PaymentInfo.tsx`**

```typescript
/**
 * 결제 정보 컴포넌트
 */

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TravelReservation, ReservationStatus } from '@/types/reservation';

const statuses: ReservationStatus[] = [
  '예약접수',
  '결제완료',
  '결제대기',
  '예약취소',
  '이용완료',
];

interface PaymentInfoProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function PaymentInfo({ data, onChange }: PaymentInfoProps) {
  const updateField = (field: keyof TravelReservation, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          상품금액 및 예약설정
        </h2>
      </div>
      <div className="p-6">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-200">
            {/* 결제 정보 필드들 */}
            {/* 기존 코드에서 관련 부분만 복사 */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**파일: `components/reservations/VoucherInfo.tsx`**

```typescript
/**
 * 바우처/인보이스 컴포넌트
 */

// 비슷한 패턴으로 구현
```

**파일: `components/reservations/HistoryLog.tsx`**

```typescript
/**
 * 예약 히스토리 로그 컴포넌트
 */

interface HistoryLogProps {
  reservationId: number;
}

export function HistoryLog({ reservationId }: HistoryLogProps) {
  // TODO: 히스토리 API 호출

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">관리 히스토리</h2>
      </div>
      <div className="p-6">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                수정일자
              </td>
              <td className="py-3 px-4">
                <span className="text-gray-500">수정 내역이 없습니다.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### STEP 5: Mock 모드 전환 (선택사항)

백엔드가 준비될 때까지 Mock 데이터를 계속 사용하려면:

**파일: `lib/api/client.ts` 수정**

```typescript
// 맨 위에 추가
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Mock 모드
  if (USE_MOCK) {
    return mockResponse<T>(endpoint, options);
  }

  // 실제 API 호출
  const url = `${API_BASE_URL}${endpoint}`;
  // ... 기존 코드
}

// Mock 응답 함수
async function mockResponse<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // 약간의 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));

  // 엔드포인트별 Mock 데이터 반환
  if (endpoint.includes('/api/reservations')) {
    const { mockReservations } = await import('@/data/mockReservations');

    if (endpoint.includes('/stats')) {
      // 통계 반환
      return {
        예약접수: 5,
        결제완료: 12,
        결제대기: 3,
        예약취소: 2,
        이용완료: 8,
      } as T;
    }

    // 목록 반환
    return {
      data: mockReservations,
      pagination: {
        total: mockReservations.length,
        page: 1,
        limit: 30,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    } as T;
  }

  throw new Error('Mock 데이터 없음');
}
```

---

### STEP 6: 문서화

#### 6.1 API 통합 가이드

**파일: `docs/API_INTEGRATION_GUIDE.md`**

```markdown
# API 통합 가이드

백엔드 개발자를 위한 API 통합 가이드입니다.

## 시작하기

### 1. 환경 변수 설정

`.env.local` 파일 생성:
\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK=false
\`\`\`

### 2. API 서버 실행

백엔드 API 서버를 3001 포트에서 실행합니다.

### 3. 프론트엔드 실행

\`\`\`bash
npm run dev
\`\`\`

## API 엔드포인트

### 예약 관련

#### 예약 목록 조회
\`\`\`
GET /api/reservations?page=1&limit=20&status=예약완료
\`\`\`

**응답:**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "productName": "호텔 예약",
      "customerName": "홍길동",
      ...
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
\`\`\`

#### 예약 상세 조회
\`\`\`
GET /api/reservations/:id
\`\`\`

#### 예약 생성
\`\`\`
POST /api/reservations
Content-Type: application/json

{
  "productName": "호텔 예약",
  "customerName": "홍길동",
  ...
}
\`\`\`

#### 예약 수정
\`\`\`
PUT /api/reservations/:id
Content-Type: application/json

{
  "status": "예약확정",
  "adminMemo": "확인 완료"
}
\`\`\`

#### 예약 삭제
\`\`\`
DELETE /api/reservations/:id
\`\`\`

#### 예약 통계
\`\`\`
GET /api/reservations/stats
\`\`\`

**응답:**
\`\`\`json
{
  "예약접수": 5,
  "결제완료": 12,
  "예약취소": 2,
  ...
}
\`\`\`

### 상품 관련

(비슷한 패턴)

### 회원 관련

(비슷한 패턴)

### 대시보드 관련

(비슷한 패턴)

## 에러 처리

모든 에러는 다음 형식으로 반환:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "예약을 찾을 수 없습니다."
  }
}
\`\`\`

### 에러 코드

- `NOT_FOUND` - 리소스를 찾을 수 없음
- `VALIDATION_ERROR` - 입력 값 검증 실패
- `UNAUTHORIZED` - 인증 필요
- `FORBIDDEN` - 권한 없음
- `SERVER_ERROR` - 서버 내부 오류

## 테스팅

### Postman 컬렉션

(TODO: Postman 컬렉션 링크)

### 샘플 데이터

개발용 샘플 데이터는 `data/mockReservations.ts` 참고
```

#### 6.2 README 업데이트

**파일: `README.md` 에 추가**

```markdown
## 백엔드 통합

### 환경 변수 설정

\`\`\`bash
cp .env.example .env.local
\`\`\`

`.env.local` 파일 수정:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

### Mock 모드

백엔드가 준비되지 않았다면 Mock 모드로 개발 가능:

\`\`\`
NEXT_PUBLIC_USE_MOCK=true
\`\`\`

### API 문서

자세한 API 통합 가이드는 `docs/API_INTEGRATION_GUIDE.md` 참고
```

---

## 체크리스트

리팩토링 완료 확인을 위한 체크리스트:

### Phase 1: 인프라 구축
- [ ] `lib/api/client.ts` 생성 완료
- [ ] `lib/api/endpoints.ts` 생성 완료
- [ ] `types/api.ts` 생성 완료
- [ ] `.env.example` 생성 완료
- [ ] `components/ui/loading-spinner.tsx` 생성 완료
- [ ] `components/ui/error-message.tsx` 생성 완료
- [ ] `components/ui/empty-state.tsx` 생성 완료

### Phase 2: 서비스 레이어
- [ ] `lib/services/reservationService.ts` 생성 완료
- [ ] `lib/services/productService.ts` 생성 완료
- [ ] `lib/services/memberService.ts` 생성 완료
- [ ] `lib/services/dashboardService.ts` 생성 완료

### Phase 3: 페이지 리팩토링
- [ ] `app/reservations/travel/page.tsx` 리팩토링 완료
- [ ] `app/reservations/travel/[id]/page.tsx` 리팩토링 완료
- [ ] `components/reservations/ReservationForm.tsx` 생성 완료
- [ ] `components/reservations/PaymentInfo.tsx` 생성 완료
- [ ] `components/reservations/VoucherInfo.tsx` 생성 완료
- [ ] `components/reservations/HistoryLog.tsx` 생성 완료
- [ ] `app/products/page.tsx` 리팩토링 완료
- [ ] `app/members/page.tsx` 리팩토링 완료
- [ ] `app/dashboard/page.tsx` 리팩토링 완료

### Phase 4: 문서화
- [ ] `docs/API_INTEGRATION_GUIDE.md` 작성 완료
- [ ] 서비스 함수에 JSDoc 주석 추가 완료
- [ ] `README.md` 업데이트 완료

### 테스팅
- [ ] 예약 목록 페이지 로딩 확인
- [ ] 예약 상세 페이지 로딩 확인
- [ ] 필터 작동 확인
- [ ] 페이지네이션 작동 확인
- [ ] 저장 기능 확인
- [ ] 삭제 기능 확인
- [ ] 에러 처리 확인
- [ ] 로딩 상태 확인

### 최종 검증
- [ ] Mock 모드로 모든 페이지 작동 확인
- [ ] 백엔드 연결 후 실제 API로 작동 확인
- [ ] 브라우저 콘솔에 에러 없음 확인
- [ ] 타입스크립트 컴파일 에러 없음 확인
- [ ] ESLint 경고 없음 확인

---

## 작업 시 주의사항

### 1. 기존 UI는 최대한 유지
- 화면 레이아웃, 디자인은 변경하지 않음
- 데이터 가져오는 방식만 변경

### 2. 타입 안정성 유지
- 모든 함수에 명확한 타입 정의
- any 타입 사용 최소화

### 3. 에러 처리 필수
- 모든 API 호출에 try-catch
- 사용자에게 친절한 에러 메시지

### 4. 로딩 상태 표시
- 데이터 로드 중 로딩 표시
- 버튼 클릭 후 로딩 표시

### 5. 코드 주석 추가
- 서비스 함수에 JSDoc
- 복잡한 로직에 설명 주석

---

## 예상 이슈 및 해결 방법

### 이슈 1: CORS 에러
**증상**: 브라우저 콘솔에 CORS policy 에러

**해결**:
백엔드에서 CORS 설정 필요:
\`\`\`javascript
// Express 예시
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
\`\`\`

### 이슈 2: 타입 불일치
**증상**: TypeScript 컴파일 에러

**해결**:
1. 백엔드 응답 형식 확인
2. `types/` 디렉토리의 인터페이스 수정
3. 필요시 타입 캐스팅 사용

### 이슈 3: 환경 변수 인식 안됨
**증상**: API_BASE_URL이 undefined

**해결**:
1. `.env.local` 파일 생성 확인
2. `NEXT_PUBLIC_` 접두사 확인
3. 개발 서버 재시작

---

## 완료 후 확인사항

1. ✅ Mock 데이터 import가 컴포넌트에서 완전히 제거됨
2. ✅ 모든 페이지가 서비스 레이어 사용
3. ✅ 로딩/에러 상태 표시 작동
4. ✅ 백엔드 API로 교체 시 서비스 파일만 수정하면 됨
5. ✅ 초보자도 패턴을 따라할 수 있음

---

## 추가 개선 사항 (선택)

시간이 더 있다면:

1. **React Query 도입** - 데이터 캐싱, 자동 리패치
2. **폼 검증 라이브러리** - React Hook Form + Zod
3. **낙관적 업데이트** - 더 빠른 UX
4. **무한 스크롤** - 페이지네이션 대신
5. **실시간 업데이트** - WebSocket 연동

---

이 문서를 참고하여 단계별로 진행하면 백엔드 통합이 수월합니다!
