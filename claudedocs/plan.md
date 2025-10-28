# Trenvl 관리자 UI 구현 계획

**작성일**: 2025-10-28
**프로젝트**: Trenvl 관리자 대시보드 UI
**기술 스택**: Next.js 15 + TypeScript + Shadcn UI + Recharts

---

## 1. 프로젝트 개요

### 목적
PRD 문서를 기반으로 Trenvl 관리자 시스템의 개선된 UI를 구현합니다.

### 구현 범위
- **UI만 구현** (백엔드 API 연동 없음)
- **Mock 데이터** 사용
- **주요 페이지** 6개 구현
- **메뉴 링크** 동작
- **데스크톱만** 지원

### 기술 선택 이유
- **Next.js 15**: 최신 App Router, Server/Client Components
- **TypeScript**: 타입 안정성
- **Shadcn UI**: 커스터마이징 가능한 컴포넌트 라이브러리
- **Recharts**: React 친화적 차트 라이브러리
- **Tailwind CSS**: 유틸리티 퍼스트 CSS

---

## 2. 프로젝트 구조

```
F:\trencrawl_admin\
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 대시보드 (/)
│   ├── login/
│   │   └── page.tsx              # 로그인 페이지
│   ├── products/
│   │   └── page.tsx              # 상품관리
│   ├── members/
│   │   └── page.tsx              # 회원관리
│   ├── boards/
│   │   └── page.tsx              # 게시판관리
│   └── statistics/
│       └── page.tsx              # 통계
├── components/
│   ├── ui/                       # Shadcn UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx            # 상단 헤더
│   │   ├── Sidebar.tsx           # 사이드바 네비게이션
│   │   └── AppLayout.tsx         # 전체 레이아웃
│   ├── dashboard/
│   │   ├── FilterSection.tsx    # 검색 필터
│   │   ├── StatsCards.tsx        # 통계 카드
│   │   ├── SalesBarChart.tsx     # 바 차트
│   │   ├── StatusPieChart.tsx    # 도넛 차트
│   │   ├── RevenueTrendChart.tsx # 라인 차트
│   │   └── ReservationTable.tsx  # 예약 테이블
│   └── common/
│       ├── LoadingSpinner.tsx    # 로딩 스피너
│       └── ConfirmDialog.tsx     # 확인 다이얼로그
├── lib/
│   └── utils.ts                  # 유틸리티 함수
├── data/
│   ├── mockReservations.ts       # 예약 Mock 데이터
│   ├── mockProducts.ts           # 상품 Mock 데이터
│   ├── mockMembers.ts            # 회원 Mock 데이터
│   └── mockStats.ts              # 통계 Mock 데이터
├── types/
│   └── index.ts                  # TypeScript 타입 정의
├── public/
│   └── images/
├── claudedocs/                   # 문서 폴더 (기존)
│   ├── report.md
│   ├── prd.md
│   └── plan.md (이 파일)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## 3. 구현 단계

### Phase 1: 프로젝트 초기화 (30분)

#### 1.1 Next.js 프로젝트 생성
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

**설정 옵션**:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ❌ src/ directory
- ✅ Import alias (@/*)

#### 1.2 Shadcn UI 초기화
```bash
npx shadcn@latest init
```

**설정**:
- Style: Default
- Base color: Slate
- CSS variables: Yes

#### 1.3 Shadcn UI 컴포넌트 설치
```bash
npx shadcn@latest add button input table select dialog toast card checkbox badge dropdown-menu separator accordion label
```

#### 1.4 추가 패키지 설치
```bash
npm install recharts date-fns lucide-react clsx tailwind-merge
```

#### 1.5 Tailwind 색상 커스터마이징
`tailwind.config.ts` 수정:
- Primary: #2D7FF9 (파란색)
- Success: #10B981 (녹색)
- Error: #EF4444 (빨강)
- Warning: #F59E0B (주황)

---

### Phase 2: 공통 요소 구현 (1시간)

#### 2.1 TypeScript 타입 정의
```typescript
// types/index.ts
export interface Reservation {
  id: number;
  groupNumber: string;
  reservationNumber: string;
  status: ReservationStatus;
  category: Category;
  productName: string;
  reservationDate: string;
  customerName: string;
  userId: string;
  phone: string;
  email: string;
  amountKRW: number;
  amountTHB: number;
  paymentMethod?: string;
}

export type ReservationStatus =
  | '예약접수' | '예약가능' | '결제완료'
  | '예약확정' | '결제대기' | '예약취소'
  | '예약불가' | '이용완료';

export type Category =
  | 'Hotels' | 'Tour' | 'K-Beauty'
  | 'Tickets' | 'Dining' | 'Vehicle'
  | 'K-goods' | 'Guide' | 'Golf';
```

#### 2.2 Mock 데이터 생성
- `data/mockReservations.ts`: 예약 데이터 162건
- `data/mockProducts.ts`: 상품 데이터
- `data/mockMembers.ts`: 회원 데이터
- `data/mockStats.ts`: 통계 데이터

#### 2.3 공통 컴포넌트
- `components/common/LoadingSpinner.tsx`
- `components/common/ConfirmDialog.tsx`

#### 2.4 레이아웃 컴포넌트
- `components/layout/Header.tsx`: 로고, 사용자 정보, 로그아웃
- `components/layout/Sidebar.tsx`: 아코디언 메뉴 (10개 카테고리, 60+ 링크)
- `components/layout/AppLayout.tsx`: Header + Sidebar + Content

---

### Phase 3: 페이지 구현 (3-4시간)

#### 3.1 로그인 페이지 (`/login`)
**컴포넌트**:
- 반반 분할 레이아웃
- 좌측: 브랜드 이미지
- 우측: 로그인 폼 (아이디, 비밀번호, 아이디 저장, 로그인 버튼)

**기능**:
- 폼 제출 시 `/` (대시보드)로 리다이렉트

---

#### 3.2 대시보드 페이지 (`/`)

**3.2.1 검색 필터 섹션**
`components/dashboard/FilterSection.tsx`

**기능**:
- 필터 접기/펴기 토글
- 기본 필터:
  - 카테고리 (1차분류)
  - 기간검색 (빠른 선택 + 날짜 범위)
  - 검색어 (검색 기준 + 텍스트)
  - 예약상품상태 (체크박스)
- 고급 필터 (접힘):
  - 결제방법
  - 2차/3차 카테고리
- 초기화 버튼
- 프리셋 저장 버튼
- 검색 버튼

**상태 관리**:
```typescript
const [isFilterExpanded, setIsFilterExpanded] = useState(true);
const [showAdvanced, setShowAdvanced] = useState(false);
const [filters, setFilters] = useState<FilterState>({
  category: '',
  dateRange: { start: '', end: '' },
  status: [],
  // ...
});
```

---

**3.2.2 통계 카드**
`components/dashboard/StatsCards.tsx`

**표시 내용**:
- 상품판매 현황 (총 198건) + 증감률
- 카테고리별 건수 (호텔 35, 투어 60, 스파 45, 레스토랑 37)
- 문의 게시판 (1:1 여행상담 1, 고객의 소리 5)
- 예약내역 통계 (예약접수, 예약가능, 결제완료 등)

---

**3.2.3 차트 섹션**

**A. 상품 판매 현황 바 차트**
`components/dashboard/SalesBarChart.tsx`

```typescript
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={salesData} layout="vertical">
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" />
    <Tooltip />
    <Bar dataKey="count" fill="#2D7FF9" />
  </BarChart>
</ResponsiveContainer>
```

**데이터**:
```typescript
const salesData = [
  { name: '호텔', count: 35, percentage: 17.7 },
  { name: '투어', count: 60, percentage: 30.3 },
  { name: '스파', count: 45, percentage: 22.7 },
  // ...
];
```

---

**B. 예약 상태별 도넛 차트**
`components/dashboard/StatusPieChart.tsx`

```typescript
<ResponsiveContainer width={200} height={200}>
  <PieChart>
    <Pie
      data={statusData}
      dataKey="value"
      nameKey="name"
      innerRadius={60}
      outerRadius={80}
    />
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

---

**C. 매출 트렌드 라인 차트**
`components/dashboard/RevenueTrendChart.tsx`

```typescript
<ResponsiveContainer width="100%" height={250}>
  <LineChart data={trendData}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="revenue" stroke="#2D7FF9" />
  </LineChart>
</ResponsiveContainer>
```

**기간 선택**: 7일 / 30일 / 90일 버튼

---

**3.2.4 예약 리스트 테이블**
`components/dashboard/ReservationTable.tsx`

**컬럼**:
- [ ] (체크박스)
- 번호
- 그룹번호
- 예약번호
- 상태 (색상 배지)
- 상품구분
- 상품명
- 예약일시
- 예약자/아이디
- 연락처/이메일
- 상품금액(원)
- 상품금액(바트)
- 결제방법
- 관리 (수정/삭제 버튼)

**기능**:
- 헤더 체크박스: 전체 선택/해제
- 행 체크박스: 개별 선택
- 선택된 행 배경색 변경
- 일괄 작업 툴바 (선택 시 표시):
  - "3개 선택됨" 배지
  - "선택 해제" 버튼
  - "상태 변경" 버튼 → 모달
  - "삭제" 버튼 → 확인 다이얼로그

**페이지네이션**:
- 표시 개수 선택: 30 / 50 / 100 / 200
- 페이지 네비게이션
- 총 개수 표시

---

#### 3.3 상품관리 페이지 (`/products`)
**구조**:
- 카테고리 탭 (Hotels, Tour, K-Beauty, etc.)
- 상품 목록 테이블
- 검색 필터 (간단 버전)
- 추가 버튼

**Mock 데이터**: 각 카테고리별 5-10개 상품

---

#### 3.4 회원관리 페이지 (`/members`)
**구조**:
- 회원 목록 테이블 (이름, 이메일, 전화번호, 등급, 가입일)
- 검색 필터 (회원 상태, 등급)
- 일반회원 / 탈퇴회원 탭

**Mock 데이터**: 30명의 회원 데이터

---

#### 3.5 게시판관리 페이지 (`/boards`)
**구조**:
- 게시판 타입 선택 (공지사항, FAQ, 이벤트, etc.)
- 게시글 목록 테이블 (제목, 작성자, 작성일, 조회수)
- 검색 필터 (기간, 검색어)

**Mock 데이터**: 각 게시판 10개 글

---

#### 3.6 통계 페이지 (`/statistics`)
**구조**:
- 기간 선택 (일별, 주별, 월별)
- 매출 차트 (라인, 바)
- 카테고리별 매출 테이블
- 회원 통계 (신규 가입, 활성 사용자)

**Mock 데이터**: 최근 30일 통계

---

### Phase 4: 인터랙션 구현 (1시간)

#### 4.1 Toast 메시지
```typescript
// lib/toast.ts
import { toast } from 'sonner' // or react-hot-toast

export const showSuccessToast = (message: string) => {
  toast.success(message, { duration: 3000 });
};

export const showErrorToast = (message: string) => {
  toast.error(message, { duration: 5000 });
};
```

**사용 예**:
- 필터 초기화: "필터가 초기화되었습니다"
- 상태 변경: "3개 예약의 상태가 변경되었습니다"
- 삭제: "3개 예약이 삭제되었습니다"

---

#### 4.2 확인 다이얼로그
```typescript
// components/common/ConfirmDialog.tsx
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
  danger?: boolean;
}
```

**사용 예**:
- 삭제 확인
- 일괄 상태 변경 확인

---

#### 4.3 로딩 스피너
```typescript
// components/common/LoadingSpinner.tsx
export function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return <Loader2 className="h-4 w-4 animate-spin" />;
}
```

---

#### 4.4 키보드 네비게이션
```typescript
// app/layout.tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl + F: 검색 포커스
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      document.getElementById('search-input')?.focus();
    }

    // ESC: 모달 닫기
    if (e.key === 'Escape') {
      // Close modals
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## 4. Mock 데이터 구조

### 4.1 예약 데이터 (data/mockReservations.ts)
```typescript
export const mockReservations: Reservation[] = [
  {
    id: 162,
    groupNumber: '20251027191423',
    reservationNumber: 'S20251027002',
    status: '예약접수',
    category: 'Hotels',
    productName: 'Hotel Venue G Myeongdong',
    reservationDate: '2025-10-27 19:14:23',
    customerName: 'KIM JIHUYN',
    userId: 'phongpx',
    phone: '866-872-816',
    email: 'pxp95211@naver.com',
    amountKRW: 169092,
    amountTHB: 118,
  },
  // ... 총 162건
];
```

### 4.2 통계 데이터 (data/mockStats.ts)
```typescript
export const salesStats = {
  total: 198,
  previousMonth: 172,
  changeRate: 15.3,
  byCategory: [
    { name: '호텔', count: 35, changeRate: 12.5 },
    { name: '투어', count: 60, changeRate: 8.2 },
    // ...
  ],
};

export const statusStats = [
  { name: '예약접수', amount: 1309785, count: 50 },
  { name: '예약가능', amount: 900000, count: 30 },
  // ...
];

export const trendData = [
  { date: '10-22', revenue: 800000 },
  { date: '10-23', revenue: 1200000 },
  // ...
];
```

---

## 5. 스타일링 가이드

### 5.1 색상 팔레트 (tailwind.config.ts)
```typescript
colors: {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#2D7FF9',
    600: '#1E40AF',
    700: '#1E3A8A',
  },
  success: {
    50: '#F0FDF4',
    500: '#10B981',
    600: '#059669',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },
  warning: {
    50: '#FFF7ED',
    500: '#F59E0B',
    600: '#D97706',
  },
}
```

### 5.2 상태별 색상 매핑
```typescript
const statusColors = {
  '예약접수': 'bg-orange-500',
  '예약가능': 'bg-green-500',
  '결제완료': 'bg-blue-500',
  '예약확정': 'bg-purple-500',
  '결제대기': 'bg-gray-500',
  '예약취소': 'bg-red-500',
};
```

### 5.3 버튼 스타일
```typescript
// Primary Button
className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md transition-colors"

// Secondary Button
className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-md transition-colors"

// Danger Button
className="bg-error-500 hover:bg-error-600 text-white px-6 py-3 rounded-md transition-colors"
```

---

## 6. 라우팅 구조

```
/                       → 대시보드 (예약관리)
/login                  → 로그인
/products               → 상품관리
/products/hotels        → 호텔 상품
/products/tours         → 투어 상품
/members                → 회원관리
/members/active         → 일반회원
/members/withdrawn      → 탈퇴회원
/boards                 → 게시판관리
/boards/notice          → 공지사항
/boards/faq             → FAQ
/statistics             → 통계
/statistics/sales       → 매출 분석
/statistics/members     → 회원 분석
```

---

## 7. 테스트 시나리오

### 7.1 기본 동작 테스트
- [ ] 로그인 페이지 접속 및 로그인
- [ ] 사이드바 메뉴 펼침/접힘
- [ ] 각 메뉴 링크 클릭 시 페이지 이동

### 7.2 필터 테스트
- [ ] 필터 접기/펴기 동작
- [ ] 고급 필터 보기/숨기기
- [ ] 카테고리 선택
- [ ] 날짜 범위 선택 (빠른 선택 + 직접 선택)
- [ ] 체크박스 다중 선택
- [ ] 검색 버튼 클릭
- [ ] 초기화 버튼
- [ ] 프리셋 저장 및 불러오기

### 7.3 차트 테스트
- [ ] 바 차트 렌더링 및 호버 툴팁
- [ ] 도넛 차트 렌더링 및 중앙 텍스트
- [ ] 라인 차트 렌더링 및 기간 선택

### 7.4 테이블 테스트
- [ ] 테이블 데이터 렌더링
- [ ] 헤더 체크박스 전체 선택/해제
- [ ] 개별 체크박스 선택
- [ ] 선택 시 배경색 변경
- [ ] 일괄 작업 툴바 표시
- [ ] 상태 변경 모달 열기
- [ ] 삭제 확인 다이얼로그
- [ ] 페이지네이션 동작

### 7.5 Toast 테스트
- [ ] 성공 메시지 표시
- [ ] 에러 메시지 표시
- [ ] 자동 사라짐
- [ ] 닫기 버튼

### 7.6 키보드 테스트
- [ ] Tab 키로 요소 이동
- [ ] Enter 키로 버튼 클릭
- [ ] Esc 키로 모달 닫기
- [ ] Space 키로 체크박스 토글

---

## 8. 성능 최적화

### 8.1 이미지 최적화
- Next.js `<Image>` 컴포넌트 사용
- WebP 포맷 사용

### 8.2 코드 스플리팅
- 동적 import 사용
```typescript
const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

### 8.3 메모이제이션
```typescript
const filteredData = useMemo(() => {
  return reservations.filter(/* ... */);
}, [reservations, filters]);
```

---

## 9. 배포 준비

### 9.1 빌드 테스트
```bash
npm run build
npm run start
```

### 9.2 환경 변수 (.env.local)
```
NEXT_PUBLIC_APP_NAME=Trenvl Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 9.3 README 작성
- 프로젝트 소개
- 설치 방법
- 실행 방법
- 기술 스택
- 폴더 구조
- 스크린샷

---

## 10. 향후 확장 가능성

### Phase 2 (백엔드 연동)
- API 엔드포인트 연동
- 실제 데이터 CRUD
- 인증/권한 구현

### Phase 3 (고도화)
- 실시간 알림 (WebSocket)
- 모바일 반응형
- 다국어 지원
- 다크 모드
- 엑셀 다운로드

---

## 11. 예상 일정

| 단계 | 작업 내용 | 예상 시간 |
|-----|----------|----------|
| Phase 1 | 프로젝트 초기화 | 30분 |
| Phase 2 | 공통 요소 구현 | 1시간 |
| Phase 3 | 페이지 구현 | 3-4시간 |
| Phase 4 | 인터랙션 구현 | 1시간 |
| **총계** | | **5.5-6.5시간** |

---

## 12. 참고 문서

- [report.md](./report.md) - UI 분석 보고서
- [prd.md](./prd.md) - 제품 요구사항 문서
- [Next.js 15 문서](https://nextjs.org/docs)
- [Shadcn UI 문서](https://ui.shadcn.com)
- [Recharts 문서](https://recharts.org)

---

**작성자**: AI Assistant
**최종 수정일**: 2025-10-28
