/**
 * 예약 관련 API 서비스
 *
 * 모든 예약 관련 API 호출을 여기서 관리
 */

import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type {
  TravelReservation,
  ReservationFilters,
  ReservationStats
} from '@/types/reservation';
import { mockReservations, mockReservationStats } from '@/data/mockReservations';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * 예약 목록 조회
 *
 * @param page - 페이지 번호 (1부터 시작)
 * @param limit - 페이지당 항목 수
 * @param filters - 필터 조건
 * @returns 페이지네이션된 예약 목록
 *
 * @example
 * const { data, pagination } = await getReservations(1, 20, {
 *   status: '예약완료'
 * });
 */
export async function getReservations(
  page: number = 1,
  limit: number = 20,
  filters?: ReservationFilters
): Promise<PaginatedResponse<TravelReservation>> {
  if (USE_MOCK) {
    // Mock 데이터 필터링 및 페이지네이션
    let filtered = [...mockReservations];

    if (filters) {
      if (filters.category) {
        filtered = filtered.filter(r => r.category === filters.category);
      }
      if (filters.statuses?.length) {
        filtered = filtered.filter(r => filters.statuses!.includes(r.status));
      }
      if (filters.paymentMethods?.length) {
        filtered = filtered.filter(r => filters.paymentMethods!.includes(r.paymentMethod));
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          r.productName.toLowerCase().includes(query) ||
          r.customerName.toLowerCase().includes(query) ||
          r.customerPhone.includes(query)
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

  // 쿼리 파라미터 구성
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // 필터 추가
  if (filters) {
    if (filters.category) params.append('category', filters.category);
    if (filters.statuses?.length) {
      filters.statuses.forEach(status => params.append('status', status));
    }
    if (filters.paymentMethods?.length) {
      filters.paymentMethods.forEach(method => params.append('paymentMethod', method));
    }
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.searchQuery) params.append('q', filters.searchQuery);
    if (filters.searchType) params.append('searchType', filters.searchType);
  }

  return get<PaginatedResponse<TravelReservation>>(
    `${ENDPOINTS.RESERVATIONS.LIST}?${params.toString()}`
  );
}

/**
 * 예약 상세 조회
 *
 * @param id - 예약 ID
 * @returns 예약 상세 정보
 *
 * @example
 * const reservation = await getReservationById(123);
 */
export async function getReservationById(
  id: number
): Promise<TravelReservation> {
  if (USE_MOCK) {
    const reservation = mockReservations.find(r => r.id === id);
    if (!reservation) {
      throw new Error(`예약을 찾을 수 없습니다. (ID: ${id})`);
    }
    return Promise.resolve(reservation);
  }
  return get<TravelReservation>(ENDPOINTS.RESERVATIONS.DETAIL(id));
}

/**
 * 예약 생성
 *
 * @param data - 예약 데이터
 * @returns 생성된 예약
 *
 * @example
 * const newReservation = await createReservation({
 *   productName: '호텔 예약',
 *   customerName: '홍길동',
 *   // ...
 * });
 */
export async function createReservation(
  data: Omit<TravelReservation, 'id' | 'createdAt'>
): Promise<TravelReservation> {
  if (USE_MOCK) {
    // Mock에서는 생성 기능 미지원
    console.warn('Mock 모드에서는 예약 생성이 지원되지 않습니다.');
    return Promise.reject(new Error('Mock 모드에서는 예약 생성이 지원되지 않습니다.'));
  }
  return post<TravelReservation>(ENDPOINTS.RESERVATIONS.CREATE, data);
}

/**
 * 예약 수정
 *
 * @param id - 예약 ID
 * @param data - 수정할 데이터 (부분 수정 가능)
 * @returns 수정된 예약
 *
 * @example
 * const updated = await updateReservation(123, {
 *   status: '예약확정',
 *   adminMemo: '확인 완료'
 * });
 */
export async function updateReservation(
  id: number,
  data: Partial<TravelReservation>
): Promise<TravelReservation> {
  if (USE_MOCK) {
    const reservation = mockReservations.find(r => r.id === id);
    if (!reservation) {
      throw new Error(`예약을 찾을 수 없습니다. (ID: ${id})`);
    }
    // Mock에서는 실제 수정하지 않고 수정된 것처럼 반환만
    return Promise.resolve({ ...reservation, ...data });
  }
  return put<TravelReservation>(ENDPOINTS.RESERVATIONS.UPDATE(id), data);
}

/**
 * 예약 삭제
 *
 * @param id - 예약 ID
 *
 * @example
 * await deleteReservation(123);
 */
export async function deleteReservation(id: number): Promise<void> {
  if (USE_MOCK) {
    console.warn('Mock 모드에서는 예약 삭제가 지원되지 않습니다.');
    return Promise.resolve();
  }
  return del<void>(ENDPOINTS.RESERVATIONS.DELETE(id));
}

/**
 * 예약 통계 조회
 *
 * @returns 예약 상태별 통계
 *
 * @example
 * const stats = await getReservationStats();
 * console.log(stats.예약완료); // 15
 */
export async function getReservationStats(): Promise<ReservationStats> {
  if (USE_MOCK) {
    return Promise.resolve(mockReservationStats);
  }
  return get<ReservationStats>(ENDPOINTS.RESERVATIONS.STATS);
}
