// ========================================
// 매출통계 관련 데이터
// ========================================

// 년별 통계 데이터
export interface YearlyStatistic {
  year: string; // 년도
  sales: number; // 매출
  products: number; // 상품수
  points: number; // 적립금
  coupons: number; // 쿠폰
}

export const mockYearlyStatistics: YearlyStatistic[] = [
  { year: '2024', sales: 0, products: 207, points: 0, coupons: 0 },
  { year: '2025', sales: 0, products: 0, points: 0, coupons: 0 },
];

// 월별 통계 데이터
export interface MonthlyStatistic {
  month: string; // 월 (2025-01)
  sales: number; // 매출
  products: number; // 상품수
  salesPercent: number; // 매출 점유율
  productsPercent: number; // 상품 점유율
  points: number; // 적립금
  coupons: number; // 쿠폰
}

export const mockMonthlyStatistics: MonthlyStatistic[] = [
  { month: '2025-01', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-02', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-03', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-04', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-05', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-06', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-07', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-08', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-09', sales: 0, products: 52, salesPercent: 0, productsPercent: 25.12, points: 0, coupons: 0 },
  { month: '2025-10', sales: 0, products: 155, salesPercent: 0, productsPercent: 74.88, points: 0, coupons: 0 },
  { month: '2025-11', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
  { month: '2025-12', sales: 0, products: 0, salesPercent: 0, productsPercent: 0, points: 0, coupons: 0 },
];

// 일별 통계 데이터
export interface DailyStatistic {
  date: string; // 날짜 (2025-10-01)
  sales: number; // 매출
  products: number; // 상품수
  salesPc: number; // PC 매출
  salesMobile: number; // 모바일 매출
  points: number; // 적립금
  coupons: number; // 쿠폰
}

export const mockDailyStatistics: DailyStatistic[] = [
  { date: '2025-10-01', sales: 0, products: 3, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-02', sales: 0, products: 0, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-03', sales: 0, products: 0, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-04', sales: 0, products: 0, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-05', sales: 0, products: 0, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-06', sales: 0, products: 7, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-07', sales: 0, products: 11, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-08', sales: 0, products: 55, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-09', sales: 0, products: 22, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
  { date: '2025-10-10', sales: 0, products: 5, salesPc: 0, salesMobile: 0, points: 0, coupons: 0 },
];

// 요일별 통계 데이터
export interface WeekdayStatistic {
  weekday: string; // 요일
  sales: number; // 매출
  products: number; // 상품수
  points: number; // 적립금
  coupons: number; // 쿠폰
}

export const mockWeekdayStatistics: WeekdayStatistic[] = [
  { weekday: '월요일', sales: 0, products: 45, points: 0, coupons: 0 },
  { weekday: '화요일', sales: 0, products: 52, points: 0, coupons: 0 },
  { weekday: '수요일', sales: 0, products: 48, points: 0, coupons: 0 },
  { weekday: '목요일', sales: 0, products: 55, points: 0, coupons: 0 },
  { weekday: '금요일', sales: 0, products: 68, points: 0, coupons: 0 },
  { weekday: '토요일', sales: 0, products: 82, points: 0, coupons: 0 },
  { weekday: '일요일', sales: 0, products: 75, points: 0, coupons: 0 },
];

// ========================================
// 결제수단 매출통계 데이터
// ========================================

export interface PaymentTypeStatistic {
  rank: number; // 순위
  paymentType: string; // 결제수단
  sales: number; // 매출
  sharePercent: number; // 점유율
}

export const mockPaymentTypeStatistics: PaymentTypeStatistic[] = [
  { rank: 1, paymentType: '카드결제', sales: 85000000, sharePercent: 65.5 },
  { rank: 2, paymentType: '무통장(가상계좌)', sales: 28000000, sharePercent: 21.5 },
  { rank: 3, paymentType: '실시간계좌이체', sales: 12000000, sharePercent: 9.2 },
  { rank: 4, paymentType: '통장입금', sales: 4800000, sharePercent: 3.8 },
];

// ========================================
// 상품분석 데이터
// ========================================

export interface ProductAnalysisStatistic {
  rank: number; // 순위
  productCode: string; // 상품코드
  productName: string; // 상품명
  salesCount: number; // 판매수량
  salesTotal: number; // 판매합계
}

export const mockProductAnalysisStatistics: ProductAnalysisStatistic[] = [
  { rank: 1, productCode: 'TOUR-001', productName: '제주도 3박4일 패키지', salesCount: 156, salesTotal: 45800000 },
  { rank: 2, productCode: 'TOUR-002', productName: '부산 해운대 2박3일', salesCount: 142, salesTotal: 38500000 },
  { rank: 3, productCode: 'TOUR-003', productName: '강원도 스키 투어', salesCount: 98, salesTotal: 28200000 },
  { rank: 4, productCode: 'TOUR-004', productName: '경주 역사탐방', salesCount: 87, salesTotal: 19800000 },
  { rank: 5, productCode: 'TOUR-005', productName: '전주 한옥마을', salesCount: 75, salesTotal: 15600000 },
  { rank: 6, productCode: 'TOUR-006', productName: '설악산 트레킹', salesCount: 68, salesTotal: 12400000 },
  { rank: 7, productCode: 'TOUR-007', productName: '남이섬 당일치기', salesCount: 52, salesTotal: 8200000 },
  { rank: 8, productCode: 'TOUR-008', productName: '가평 펜션 투어', salesCount: 45, salesTotal: 6800000 },
  { rank: 9, productCode: 'TOUR-009', productName: '속초 해변 여행', salesCount: 38, salesTotal: 5500000 },
  { rank: 10, productCode: 'TOUR-010', productName: '대구 시티투어', salesCount: 32, salesTotal: 4200000 },
];

// ========================================
// 요약 데이터
// ========================================

export const mockTotalSummary = {
  sales: 0,
  products: 207,
  salesPc: 0,
  salesMobile: 0,
  productsPc: 154,
  productsMobile: 53,
  points: 0,
  coupons: 0,
};
