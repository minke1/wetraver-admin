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
  return get<ReservationStats>(ENDPOINTS.RESERVATIONS.STATS);
}
