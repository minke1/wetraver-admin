/**
 * 대시보드 관련 API 서비스
 */

import { get } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { TravelReservation } from '@/types/reservation';

// Dashboard 타입 임시 정의
interface DashboardStats {
  totalRevenue: number;
  totalReservations: number;
  totalProducts: number;
  totalMembers: number;
  [key: string]: unknown;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  [key: string]: unknown;
}

interface ProductSales {
  productName: string;
  sales: number;
  [key: string]: unknown;
}

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
