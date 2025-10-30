export type ReservationStatus =
  | '예약접수'
  | '예약가능'
  | '결제완료'
  | '예약확정'
  | '결제대기'
  | '예약취소'
  | '예약불가'
  | '이용완료';

export type ProductCategory =
  | 'Hotels'
  | 'Tour'
  | 'K-Beauty'
  | 'Tickets'
  | 'Dining'
  | 'Vehicle'
  | 'K-goods'
  | 'Guide'
  | 'Golf';

export type PaymentMethod =
  | '신용카드'
  | '실시간계좌이체'
  | '가상계좌'
  | '계좌입금'
  | '포인트';

export interface TravelReservation {
  id: number;
  groupNumber: string;
  reservationNumber: string;
  status: ReservationStatus;
  productCategory: ProductCategory;
  productName: string;
  reservationDate: string;
  customerName: string;
  customerId: string;
  phone: string;
  email: string;
  priceKRW: number;
  priceTHB: number;
  paymentMethod?: PaymentMethod;

  // 상세 정보
  firstName?: string;
  lastName?: string;
  passportNumber?: string;
  passportExpiry?: string;
  gender?: '남자' | '여자';
  birthDate?: string;
  countryCode?: string;
  localContact?: string;
  roomType?: string;
  promotion?: string;
  mealPlan?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  rooms?: number;
  adults?: number;
  children?: number;
  bedding?: string;
  specialRequests?: string;
  specialRequestsEn?: string;
  adminMemo?: string;

  // Vehicle 전용 필드
  departure?: string; // 출발지
  destination?: string; // 도착지
  meetingDate?: string; // 미팅날짜
  productOption?: string; // 상품선택
  flightArrivalDate?: string; // 항공 도착 날짜
  flightArrivalTime?: string; // 항공 도착 시간 (HH:mm 형식)
  pickupLocation?: string; // 출발지(픽업호텔)
  dropoffLocation?: string; // 목적지(골프장명)
  otherRequests?: string; // 기타요청
  changeApplied?: boolean; // 변경사항 적용
  changeNotes?: string; // 변경사항 내용

  // 금액 정보
  totalAmountKRW?: number;
  totalAmountUSD?: number;

  // 바우처/인보이스
  invoiceStatus?: '인보이스 준비' | '인보이스 발송';
  voucherStatus?: '바우처 준비' | '바우처 발송';
  voucherDate?: string;

  // 담당자 정보
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;

  // 메타 정보
  createdAt: string;
  updatedAt?: string;
}

export interface ReservationFilters {
  category?: ProductCategory;
  category2?: string;
  category3?: string;
  paymentMethods?: PaymentMethod[];
  statuses?: ReservationStatus[];
  dateType?: '예약일' | '선금결제일' | '잔금결제일' | '취소일';
  startDate?: string;
  endDate?: string;
  searchType?: '예약번호' | '예약자명' | '담당자명' | '상품명' | '예약지휴대폰';
  searchQuery?: string;
}

export interface ReservationStats {
  예약접수: number;
  예약가능: number;
  결제완료: number;
  예약확정: number;
  예약취소: number;
  예약불가: number;
  이용완료: number;
}
