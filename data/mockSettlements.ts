import { Settlement, SettlementStats, SettlementSalesStats, SettlementPeriodStats } from '@/types/settlement';

export const mockSettlements: Settlement[] = [
  {
    id: 1,
    groupNumber: '20251020193501',
    reservationNumber: 'S20251020003',
    status: '예약확정',
    productCategory: 'K-goods',
    productName: 'bewants Peptide-X Firming Eye Serum Stick 15ml Set (+Refill 15ml)',
    commission: 1400, // 수수료 10%
    points: 0,
    coupon: 0,
    reservationDate: '2025-10-20 19:43:33',
    customerName: 'kim pyoungjin',
    customerId: 'lifeess',
    phone: '010-2295-1902',
    email: 'lifeess22@gmail.com',
    priceKRW: 14000,
    priceTHB: 9.8,
    paymentMethod: '신용카드',
    settlementStatus: '정산대기',
    createdAt: '2025-10-20 19:43:33',
  },
  {
    id: 2,
    groupNumber: '20251027183959',
    reservationNumber: 'S20251027001',
    status: '예약가능',
    productCategory: 'Hotels',
    productName: 'Hotel Lotte Signiel Seoul',
    commission: 90000, // 수수료 10%
    points: 0,
    coupon: 0,
    reservationDate: '2025-10-27 18:39:59',
    customerName: 'kim pj',
    customerId: 'lifeess01',
    phone: '010-2295-1902',
    email: 'lifeess@naver.com',
    priceKRW: 900000,
    priceTHB: 630,
    paymentMethod: '신용카드',
    settlementStatus: '정산대기',
    createdAt: '2025-10-27 18:39:59',
  },
  {
    id: 3,
    groupNumber: '20251022174742',
    reservationNumber: 'S20251022004',
    status: '예약접수',
    productCategory: 'Vehicle',
    productName: 'VIP VAN',
    commission: 14000, // 수수료 10%
    points: 0,
    coupon: 0,
    reservationDate: '2025-10-22 17:47:42',
    customerName: 'The vt',
    customerId: 'The123',
    phone: '010-2729-7385',
    email: 'thevu221099@naver.com',
    priceKRW: 140000,
    priceTHB: 98,
    paymentMethod: '신용카드',
    settlementStatus: '정산대기',
    createdAt: '2025-10-22 17:47:42',
  },
];

export const mockSettlementStats: SettlementStats = {
  salesAmount: 1054000, // 판매금액
  commission: 105400, // 수수료
  points: 0,
  coupon: 0,
  totalProfit: 948600, // 총수익
  salesCount: 3,
};

export const mockSettlementSalesStats: SettlementSalesStats = {
  예약접수: 140000,
  예약가능: 900000,
  결제완료: 0,
  예약확정: 14000,
  예약취소: 0,
  예약불가: 0,
  이용완료: 0,
};

export const mockSettlementPeriodStats: SettlementPeriodStats = {
  todaySales: 0, // 금일 매출액
  yesterdaySales: 107448, // 전일 매출액
  lastWeekSales: 3489529, // 전주 매출액
  thisMonthSales: 4878880, // 당월 매출액
};
