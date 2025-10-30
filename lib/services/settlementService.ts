/**
 * 정산 관련 API 서비스
 */

import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type {
  Settlement,
  SettlementFilters,
  SettlementStats,
  SettlementSalesStats,
  SettlementPeriodStats,
} from '@/types/settlement';
import {
  mockSettlements,
  mockSettlementStats,
  mockSettlementSalesStats,
  mockSettlementPeriodStats,
} from '@/data/mockSettlements';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * 정산 목록 조회
 */
export async function getSettlements(
  page: number = 1,
  limit: number = 30,
  filters?: SettlementFilters
): Promise<PaginatedResponse<Settlement>> {
  if (USE_MOCK) {
    // Mock 데이터 필터링 및 페이지네이션
    let filtered = [...mockSettlements];

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter((s) =>
          s.productCategory.includes(filters.category!)
        );
      }
      if (filters.paymentMethods?.length) {
        filtered = filtered.filter((s) =>
          filters.paymentMethods!.includes(s.paymentMethod!)
        );
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.productName.toLowerCase().includes(query) ||
            s.customerName.toLowerCase().includes(query) ||
            s.reservationNumber.includes(query)
        );
      }
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);
    const totalPages = Math.ceil(filtered.length / limit);

    return Promise.resolve({
      data: paginatedData,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }

  // 실제 API 호출
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.paymentMethods?.length) {
      filters.paymentMethods.forEach((method) =>
        params.append('paymentMethod', method)
      );
    }
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.searchQuery) params.append('q', filters.searchQuery);
    if (filters.searchType) params.append('searchType', filters.searchType);
  }

  return get<PaginatedResponse<Settlement>>(
    `${ENDPOINTS.SETTLEMENTS}?${params}`
  );
}

/**
 * 정산 통계 조회
 */
export async function getSettlementStats(): Promise<SettlementStats> {
  if (USE_MOCK) {
    return Promise.resolve(mockSettlementStats);
  }

  return get<SettlementStats>(`${ENDPOINTS.SETTLEMENTS}/stats`);
}

/**
 * 정산 판매 상태 통계 조회
 */
export async function getSettlementSalesStats(): Promise<SettlementSalesStats> {
  if (USE_MOCK) {
    return Promise.resolve(mockSettlementSalesStats);
  }

  return get<SettlementSalesStats>(`${ENDPOINTS.SETTLEMENTS}/sales-stats`);
}

/**
 * 정산 기간별 통계 조회 (금일/전일/전주/당월)
 */
export async function getSettlementPeriodStats(): Promise<SettlementPeriodStats> {
  if (USE_MOCK) {
    return Promise.resolve(mockSettlementPeriodStats);
  }

  return get<SettlementPeriodStats>(`${ENDPOINTS.SETTLEMENTS}/period-stats`);
}

/**
 * 정산 상세 조회
 */
export async function getSettlementById(id: number): Promise<Settlement> {
  if (USE_MOCK) {
    const settlement = mockSettlements.find((s) => s.id === id);
    if (!settlement) {
      throw new Error('정산 정보를 찾을 수 없습니다.');
    }
    return Promise.resolve(settlement);
  }

  return get<Settlement>(`${ENDPOINTS.SETTLEMENTS}/${id}`);
}

/**
 * 정산 수정
 */
export async function updateSettlement(
  id: number,
  data: Partial<Settlement>
): Promise<Settlement> {
  if (USE_MOCK) {
    console.log('Mock: 정산 수정', id, data);
    const settlement = mockSettlements.find((s) => s.id === id);
    if (!settlement) {
      throw new Error('정산 정보를 찾을 수 없습니다.');
    }
    return Promise.resolve({ ...settlement, ...data });
  }

  return put<Settlement>(`${ENDPOINTS.SETTLEMENTS}/${id}`, data);
}

/**
 * 정산 삭제
 */
export async function deleteSettlement(id: number): Promise<void> {
  if (USE_MOCK) {
    console.log('Mock: 정산 삭제', id);
    return Promise.resolve();
  }

  return del(`${ENDPOINTS.SETTLEMENTS}/${id}`);
}
