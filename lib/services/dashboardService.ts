/**
 * 대시보드 관련 API 서비스
 */

import { get } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Reservation } from '@/lib/mock-data/reservations';
import type { DashboardStats, DailyRevenue, ProductSales } from '@/lib/mock-data/dashboard';
import {
  getDashboardStats as getMockDashboardStats,
  getDailyRevenue as getMockDailyRevenue,
  getProductSales as getMockProductSales,
  getRecentReservations as getMockRecentReservations
} from '@/lib/mock-data/dashboard';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) {
    return Promise.resolve(getMockDashboardStats());
  }
  return get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS);
}

export async function getDailyRevenue(
  startDate?: string,
  endDate?: string
): Promise<DailyRevenue[]> {
  if (USE_MOCK) {
    // Mock 데이터는 날짜 필터링 없이 전체 반환
    return Promise.resolve(getMockDailyRevenue());
  }

  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return get<DailyRevenue[]>(
    `${ENDPOINTS.DASHBOARD.REVENUE}?${params.toString()}`
  );
}

export async function getProductSales(): Promise<ProductSales[]> {
  if (USE_MOCK) {
    return Promise.resolve(getMockProductSales());
  }
  return get<ProductSales[]>(ENDPOINTS.DASHBOARD.PRODUCT_SALES);
}

export async function getRecentReservations(): Promise<Reservation[]> {
  if (USE_MOCK) {
    return Promise.resolve(getMockRecentReservations());
  }
  return get<Reservation[]>(ENDPOINTS.DASHBOARD.RECENT_RESERVATIONS);
}
