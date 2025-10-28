import { mockReservations } from './reservations';
import { mockProducts } from './products';
import { mockMembers } from './members';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalMembers: number;
  activeProducts: number;
  revenueChange: number;
  ordersChange: number;
  membersChange: number;
  productsChange: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductSales {
  productName: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface MemberStats {
  grade: 'VIP' | 'GOLD' | 'SILVER' | 'BRONZE';
  count: number;
  percentage: number;
}

export interface RegionStats {
  region: string;
  orders: number;
  revenue: number;
}

// 대시보드 주요 통계
export function getDashboardStats(): DashboardStats {
  const totalRevenue = mockReservations
    .filter(r => r.status === '예약완료')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalOrders = mockReservations.filter(r => r.status === '예약완료').length;
  const totalMembers = mockMembers.filter(m => m.status === '정상').length;
  const activeProducts = mockProducts.filter(p => p.status === '판매중').length;

  return {
    totalRevenue,
    totalOrders,
    totalMembers,
    activeProducts,
    revenueChange: 12.5,
    ordersChange: 8.3,
    membersChange: 15.2,
    productsChange: 5.7,
  };
}

// 일별 매출 추이 (최근 30일)
export function getDailyRevenue(): DailyRevenue[] {
  const today = new Date();
  const dailyData: DailyRevenue[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // 랜덤 mock 데이터 생성 (주말에 더 많은 주문)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseOrders = isWeekend ? Math.floor(Math.random() * 15 + 10) : Math.floor(Math.random() * 10 + 5);
    const avgOrderValue = Math.floor(Math.random() * 200000 + 150000);

    dailyData.push({
      date: dateStr,
      revenue: baseOrders * avgOrderValue,
      orders: baseOrders,
    });
  }

  return dailyData;
}

// 상품별 판매 현황 (Top 10)
export function getProductSales(): ProductSales[] {
  const productMap = new Map<string, { sales: number; revenue: number }>();

  mockReservations
    .filter(r => r.status === '예약완료')
    .forEach(r => {
      const existing = productMap.get(r.productName) || { sales: 0, revenue: 0 };
      productMap.set(r.productName, {
        sales: existing.sales + 1,
        revenue: existing.revenue + r.amount,
      });
    });

  const totalRevenue = Array.from(productMap.values()).reduce((sum, p) => sum + p.revenue, 0);

  const sorted = Array.from(productMap.entries())
    .map(([name, data]) => ({
      productName: name,
      sales: data.sales,
      revenue: data.revenue,
      percentage: (data.revenue / totalRevenue) * 100,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return sorted;
}

// 회원 등급별 통계
export function getMemberStats(): MemberStats[] {
  const grades: MemberStats['grade'][] = ['VIP', 'GOLD', 'SILVER', 'BRONZE'];
  const activeMembers = mockMembers.filter(m => m.status === '정상');
  const total = activeMembers.length;

  return grades.map(grade => {
    const count = activeMembers.filter(m => m.grade === grade).length;
    return {
      grade,
      count,
      percentage: (count / total) * 100,
    };
  });
}

// 지역별 예약 통계
export function getRegionStats(): RegionStats[] {
  const regions = ['Seoul', 'Busan', 'Jeju', 'Gangwon', 'Gyeongju', 'Jeonju', 'Yeosu', 'Sokcho', 'Daegu', 'Incheon'];

  return regions.map(region => {
    const orders = Math.floor(Math.random() * 50 + 30);
    const avgOrderValue = Math.floor(Math.random() * 250000 + 150000);

    return {
      region,
      orders,
      revenue: orders * avgOrderValue,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

// 최근 예약 목록 (최신 10건)
export function getRecentReservations() {
  return [...mockReservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
}
