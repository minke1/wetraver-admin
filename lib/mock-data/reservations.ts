export interface Reservation {
  id: string;
  productName: string;
  customerName: string;
  email: string;
  phone: string;
  reservationDate: string;
  travelDate: string;
  status: '예약완료' | '결제대기' | '취소' | '환불완료';
  amount: number;
  persons: number;
  paymentMethod: '카드' | '계좌이체' | '무통장입금';
  createdAt: string;
}

const statuses: Reservation['status'][] = ['예약완료', '결제대기', '취소', '환불완료'];
const paymentMethods: Reservation['paymentMethod'][] = ['카드', '계좌이체', '무통장입금'];
const products = [
  '제주도 3박4일 패키지',
  '부산 해운대 2박3일',
  '강원도 스키 투어',
  '경주 역사탐방',
  '설악산 트레킹',
  '전주 한옥마을',
  '여수 밤바다 투어',
  '속초 해변 휴양',
  '대구 팔공산',
  '인천 차이나타운',
];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateReservation(index: number): Reservation {
  const statusIndex = Math.floor(Math.random() * statuses.length);
  const productIndex = Math.floor(Math.random() * products.length);
  const paymentIndex = Math.floor(Math.random() * paymentMethods.length);

  const createdAt = generateRandomDate(new Date('2024-01-01'), new Date('2024-12-31'));
  const travelDate = generateRandomDate(new Date('2024-06-01'), new Date('2025-06-30'));

  return {
    id: `RES-2024-${String(index + 1).padStart(5, '0')}`,
    productName: products[productIndex],
    customerName: `홍길동${index % 50 + 1}`,
    email: `customer${index + 1}@example.com`,
    phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    reservationDate: createdAt,
    travelDate: travelDate,
    status: statuses[statusIndex],
    amount: Math.floor(Math.random() * 500000 + 100000),
    persons: Math.floor(Math.random() * 4) + 1,
    paymentMethod: paymentMethods[paymentIndex],
    createdAt: createdAt,
  };
}

export const mockReservations: Reservation[] = Array.from({ length: 162 }, (_, i) => generateReservation(i));

export function getReservations(
  page: number = 1,
  limit: number = 20,
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }
): { data: Reservation[]; total: number; page: number; totalPages: number } {
  let filtered = [...mockReservations];

  if (filters) {
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(r => r.reservationDate >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(r => r.reservationDate <= filters.dateTo!);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.customerName.toLowerCase().includes(term) ||
          r.productName.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term)
      );
    }
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, page, totalPages };
}
