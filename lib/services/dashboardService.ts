/**
 * 대시보드 관련 API 서비스
 */

import { get } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { TravelReservation } from '@/types/reservation';
import type { DashboardStats, DailyRevenue, ProductSales } from '@/lib/mock-data/dashboard';

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
