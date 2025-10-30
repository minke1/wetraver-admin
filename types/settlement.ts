export type SettlementStatus = '정산대기' | '정산완료' | '정산보류';

export type SettlementPaymentMethod =
  | '신용카드'
  | '실시간계좌이체'
  | '포인트';

export interface Settlement {
  id: number;
  groupNumber: string;
  reservationNumber: string;
  status: string; // 예약 상태
  productCategory: string;
  productName: string;
  commission: number; // 수수료
  points: number;
  coupon: number;
  reservationDate: string;
  customerName: string;
  customerId: string;
  phone: string;
  email: string;
  priceKRW: number;
  priceTHB: number;
  paymentMethod?: SettlementPaymentMethod;
  settlementStatus?: SettlementStatus;
  createdAt: string;
}

export interface SettlementStats {
  salesAmount: number; // 판매금액
  commission: number; // 수수료 (지출금액)
  points: number;
  coupon: number;
  totalProfit: number; // 총수익
  salesCount: number; // 판매갯수
}

export interface SettlementSalesStats {
  예약접수: number;
  예약가능: number;
  결제완료: number;
  예약확정: number;
  예약취소: number;
  예약불가: number;
  이용완료: number;
}

export interface SettlementPeriodStats {
  todaySales: number; // 금일 매출액
  yesterdaySales: number; // 전일 매출액
  lastWeekSales: number; // 전주 매출액
  thisMonthSales: number; // 당월 매출액
}

export interface SettlementFilters {
  category?: string;
  category2?: string;
  category3?: string;
  paymentMethods?: SettlementPaymentMethod[];
  dateType?: '예약일' | '선금결제일' | '잔금결제일' | '취소일';
  startDate?: string;
  endDate?: string;
  searchType?: '예약번호' | '예약자명' | '담당자명' | '상품명' | '예약지휴대폰';
  searchQuery?: string;
}
